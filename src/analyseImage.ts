import {
  decode,
  threshold,
  Image,
  fromMask,
  RoiKind,
  ThresholdAlgorithm,
} from 'image-js';

export function analyseImage(image: Image) {
  const grey = image.grey({ algorithm: 'max' });
  const mask = threshold(grey, { algorithm: ThresholdAlgorithm.INTERMODES });

  const roiMapManager = fromMask(mask);

  let rois = roiMapManager.getRois({ kind: RoiKind.BLACK });

  console.table(rois);
}
