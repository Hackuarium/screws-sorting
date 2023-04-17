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
import MaskViewer from '../MaskViewer';

import ROIsTable from './ROIsTable';
import { pickAndSortGCode, raiseAndDropGCode } from './gcode';

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
  });
  mask.invert({ out: mask });
  mask.clearBorder({ out: mask });
  mask.invert({ out: mask });

  const roiMapManager = fromMask(mask);

  let rois = roiMapManager.getRois({ kind: RoiKind.BLACK, minSurface: 100 });

  const data = [];
  for (const roi of rois) {
    const datum: any = roi.toJSON();

    const category = determineCategory(roi, roiMapManager);

    datum.crop = painted.crop(roi);
    datum.category = category;
    datum.color = colors[category.kind.replace(/ .*/, '')] || [
      100, 100, 100, 255,
    ];

    data.push(datum);
  }
  appendDistance(data);
  appendGroup(data);
  for (let i = 0; i < rois.length; i++) {
    const roi = rois[i];
    const datum = data[i];
    const mask: Mask = roi.getMask();
    const color = datum.color.slice();
    if (datum.minDistance < 50) {
      color[3] = 65;
    }
    painted.paintMask(mask, {
      origin: roi.origin,
      color,
      out: painted,
    });
  }
  const gcode = generateGCode(data);

  return (
    <div>
      <ROIsTable data={data} />
      <textarea cols={100} rows={10} readOnly value={gcode} />
      <ImageViewer
        image={painted}
        rois={rois}
        roiOptions={{
          label: (roi) => {
            const datum = data.find((datum) => datum.id === roi.id);
            if (!datum) return 'error';
            const labels = [];
            labels.push(datum.category.kind);
            if (datum.group) labels.push(datum.group.id);
            return labels.join(' ');
          },
        }}
      />
      <MaskViewer mask={mask} />
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

function appendDistance(data: any[]) {
  for (const datum of data) {
    datum.minDistance = Number.MAX_SAFE_INTEGER;
  }
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue;
      const distance = getDistance(data[i], data[j]);
      if (distance < data[i].minDistance) {
        data[i].minDistance = distance;
      }
    }
  }
}

/**
 * We need to group the different ROI based on their similarity
 * @param data
 */
function appendGroup(data: any) {
  const groups = [];
  for (const datum of data) {
    if (!['screw', 'washer', 'bolt'].includes(datum.category.kind)) continue;
    const group = getGroup(groups, datum);
    group.data.push(datum);
  }
  for (const group of groups) {
    for (const datum of group.data) {
      datum.group = group;
    }
  }
}

function getGroup(groups: any[], datum: any) {
  for (const group of groups) {
    if (group.kind !== datum.category.kind) continue;
    if (datum.category.kind === 'washer' || datum.category.kind === 'bolt') {
      for (const groupDatum of group.data) {
        if (
          Math.max(groupDatum.category.size, datum.category.size) /
            Math.min(groupDatum.category.size, datum.category.size) <
          1.1
        ) {
          return group;
        }
      }
    }
    if (datum.category.kind === 'screw') {
      for (const groupDatum of group.data) {
        if (
          Math.max(groupDatum.surface, datum.surface) /
            Math.min(groupDatum.surface, datum.surface) <
          1.1
        ) {
          return group;
        }
      }
    }
  }
  const group = {
    kind: datum.category.kind,
    id: groups.length + 1,
    data: [],
  };
  groups.push(group);
  return group;
}

function getDistance(datum1: any, datum2: any) {
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (const point1 of datum1.mbr.points) {
    for (const point2 of datum2.mbr.points) {
      const row1 = point1.row + datum1.origin.row;
      const column1 = point1.column + datum1.origin.column;
      const row2 = point2.row + datum2.origin.row;
      const column2 = point2.column + datum2.origin.column;

      const distance = Math.sqrt((column1 - column2) ** 2 + (row1 - row2) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  }
  return minDistance;
}

function generateGCode(data: any[]) {
  const gcode = [];

  gcode.push('// Sorting the washer, bolt and screws');
  const okToSorts = data.filter((datum) =>
    ['washer', 'screw', 'bolt'].includes(datum.category.kind),
  );
  for (const entity of okToSorts) {
    pickAndSortGCode(gcode, entity);
  }

  const verticalScrews = data.filter(
    (datum) => datum.category.kind === 'verticalScrew',
  );
  gcode.push('', '// Shaking the vertical screws');
  for (const entity of verticalScrews) {
    raiseAndDropGCode(gcode, entity);
  }

  const groups = data.filter((datum) => datum.category.kind === 'group');
  gcode.push('', '// Shaking the groups');
  for (const entity of groups) {
    raiseAndDropGCode(gcode, entity);
  }

  return gcode.join('\n');
}
