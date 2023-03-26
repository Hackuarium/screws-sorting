import {
  Image,
  threshold,
  fromMask,
  RoiKind,
  ThresholdAlgorithm,
  Mask,
} from 'image-js';
import { xMedian } from 'ml-spectra-processing';

import ImageViewer from '../ImageViewer';
import { codeToId } from '../template/encodeDecode';

import ROIsTable from './ROIsTable';

export default function ExploreROIs(props: { image: Image }) {
  let { image } = props;

  if (!image) {
    return <div>No selected image</div>;
  }
  let painted = image.clone();
  if (image.channels > 1) {
    image = image.grey({ algorithm: 'blue' }); // max or blue
  }

  const mask = threshold(image, { algorithm: ThresholdAlgorithm.MINIMUM });

  const roiMapManager = fromMask(mask);

  let rois = roiMapManager.getRois({ kind: RoiKind.BLACK, minSurface: 100 });

  const data = [];
  for (const roi of rois) {
    const mask: Mask = roi.getMask();

    const datum: any = roi.toJSON();

    if (datum.fillRatio < 0.9) {
      const tag = extractTag(datum, mask);
      datum.tag = tag;
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

function extractTag(datum, mask: Mask) {
  const medians = getMedians(mask);
  const code = codeToId(medians.join(''));
  const row = code % 13;
  const column = (code / 13) << 0;
  if (Number.isNaN(row) || Number.isNaN(column)) {
    return { row: Number.NaN, column: Number.NaN, raw: medians.join('') };
  }
  return { row, column, raw: medians.join(''), code };
}

function getMedians(mask: Mask) {
  const hSlots = mask.width / 5;
  const vSlots = mask.height / 5;
  const medians = [];
  for (let j = 1; j < 4; j++) {
    for (let i = 1; i < 4; i++) {
      const values = [];
      for (
        let column = ((hSlots * i) << 0) + 1;
        column < hSlots * (i + 1) - 1;
        column++
      ) {
        for (
          let row = ((vSlots * j) << 0) + 1;
          row < vSlots * (j + 1) - 1;
          row++
        ) {
          values.push(mask.getBit(column, row) ? 1 : 0);
        }
      }
      medians.push(xMedian(values));
    }
  }
  return medians;
}
