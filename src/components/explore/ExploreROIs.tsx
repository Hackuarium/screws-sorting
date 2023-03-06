import {
  Image,
  threshold,
  fromMask,
  RoiKind,
  ThresholdAlgorithm,
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
    image = image.grey();
  }

  const mask = threshold(image, { algorithm: ThresholdAlgorithm.MINIMUM });

  const roiMapManager = fromMask(mask);

  let rois = roiMapManager.getRois({ kind: RoiKind.BLACK, minSurface: 100 });

  const data = [];
  for (const roi of rois) {
    const mask = roi.getMask();
    painted.paintMask(mask, {
      origin: roi.origin,
      color: [255, 0, 0, 255],
      out: painted,
    });
    const datum = {
      origin: roi.origin,
      width: roi.width,
      height: roi.height,
      surface: roi.surface,
      mbr: mask.getMbr(),
      feret: mask.getFeret(),
      hull: mask.getConvexHull(),
      crop: painted.crop(roi),
    };
    data.push(datum);
  }

  // we will calculate all the grey algorithms
  return (
    <div>
      <ROIsTable data={data} />
      <ImageViewer image={painted} zoom={0.5} />
    </div>
  );
}
