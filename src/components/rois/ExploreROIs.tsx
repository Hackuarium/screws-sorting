import {
  Image,
  threshold,
  fromMask,
  RoiKind,
  ThresholdAlgorithm,
  Mask,
  Roi,
  RoiMapManager,
} from 'image-js';

import ImageViewer from '../ImageViewer';

import ROIsTable from './ROIsTable';

export default function ExploreROIs(props: { image: Image }) {
  let { image } = props;

  if (!image) {
    return <div>No selected image</div>;
  }
  let painted = image.clone();
  if (image.channels > 1) {
    image = image.grey({ algorithm: 'black' }).invert(); // max or blue, magenta.invert or black.invert
  }

  const mask = threshold(image, {
    algorithm: ThresholdAlgorithm.MINIMUM,
  })
    .invert()
    .clearBorder({})
    .invert();

  const roiMapManager = fromMask(mask);

  let rois = roiMapManager.getRois({ kind: RoiKind.BLACK, minSurface: 100 });

  const data = [];
  for (const roi of rois) {
    const mask: Mask = roi.getMask();

    const datum: any = roi.toJSON();

    const category = determineCategory(roi, roiMapManager);

    datum.crop = painted.crop(roi);
    datum.category = category;
    datum.color = colors[category.kind.replace(/ .*/, '')] || [
      100, 100, 100, 255,
    ];
    painted.paintMask(mask, {
      origin: roi.origin,
      color: datum.color,
      out: painted,
    });

    data.push(datum);
  }

  return (
    <div>
      <ROIsTable data={data} />
      <ImageViewer
        image={painted}
        zoom={0.5}
        rois={rois}
        roiOptions={{
          label: (roi) => {
            const datum = data.find((datum) => datum.id === roi.id);
            if (!datum) return 'error';
            if (datum.category.size === undefined) return datum.category.kind;
            return `${datum.category.kind} ${datum.category.size}`;
          },
        }}
      />
    </div>
  );
}

type Kind = 'screw' | 'verticalScrew' | 'group' | 'bolt' | 'washer' | 'other';

const colors = {
  screw: [0, 255, 0, 255],
  verticalScrew: [0, 255, 255, 255],
  bolt: [255, 255, 0, 255],
  washer: [255, 127, 0, 255],
  group: [150, 150, 150, 255],
  hole: [187, 39, 249, 255],
  other: [255, 0, 0, 255],
};

function determineCategory(
  roi: Roi,
  roiMapManager: RoiMapManager,
): { kind: Kind; size?: string } {
  let kind;
  if (
    roi.fillRatio > 0.98 && // fill ratio check if there is no holes
    // there is no hole, expected to be a screw but it could be on the head, so useless
    roi.roundness > 0.75
  ) {
    // a screw
    return { kind: 'verticalScrew' };
  }

  const compactness =
    (roi.surface + roi.holesInfo.surface) / roi.convexHull.surface;
  if (roi.holesInfo.number === 1 && compactness > 0.95) {
    // bolt or washer
    if (roi.feret.aspectRatio < 0.91) {
      return {
        kind: 'bolt',
        size: getBoltWasherM(roi, roiMapManager),
      };
    } else {
      return {
        kind: 'washer',
        size: getBoltWasherM(roi, roiMapManager),
      };
    }
  }

  if (roi.holesInfo.number >= 1 && roi.holesInfo.surface > 0.1 * roi.surface) {
    return { kind: `group` };
  }

  const roiMask = roi.getMask();
  const eroded = roiMask.dilate({ iterations: 1 }).erode({ iterations: 4 });
  const erodedRois = fromMask(eroded).getRois({
    kind: RoiKind.WHITE,
  });

  if (roi.solidity < 0.4 || erodedRois.length > 1) {
    // a group
    kind = 'group';
  } else {
    kind = `screw`;
  }

  return { kind };
}

function getBoltWasherM(roi: Roi, roiMapManager: RoiMapManager): string {
  const holeID = roi.internalIDs[1];
  const hole = roiMapManager.whiteRois[holeID - 1];
  return hole.ped && hole.ped.toFixed(0);
}
