import {
  Image,
  threshold,
  fromMask,
  RoiKind,
  ThresholdAlgorithm,
  Mask,
} from 'image-js';

import ImageViewer from '../ImageViewer';

import ROIsTable from './ROIsTable';
import { extractTag } from './extractTag';

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

    if (datum.fillRatio < 0.9) {
      datum.tag = extractTag(datum, mask);
    } else {
      datum.tag = { row: Number.NaN, column: Number.NaN };
    }

    let color;
    if (datum.fillRatio > 0.98) {
      // a screw
      color = [0, 255, 0, 255];
    } else if (datum.roundness < 0.5) {
      // a group
      color = [0, 0, 0, 255];
    } else {
      color = [255, 0, 0, 255];
    }
    painted.paintMask(mask, {
      origin: roi.origin,
      color,
      out: painted,
    });
    datum.crop = painted.crop(roi);

    data.push(datum);
  }

  return (
    <div>
      <ROIsTable data={data} />
      <ImageViewer image={painted} zoom={0.5} rois={rois} />
    </div>
  );
}
