import { Mask } from 'image-js';
import { xMedian } from 'ml-spectra-processing';

import { codeToId } from '../template/encodeDecode';

export function extractTag(datum, mask: Mask) {
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
