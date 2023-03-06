import {
  Image,
  threshold,
  fromMask,
  RoiKind,
  ThresholdAlgorithm,
} from 'image-js';

import ImageViewer from '../ImageViewer';

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

  const results = [];
  for (const roi of rois) {
    const result = {
      origin: roi.origin,
      width: roi.width,
      height: roi.height,
      surface: roi.surface,
    };
    const mask = roi.getMask();
    result.mbr = mask.getMbr();
    result.feret = mask.getFeret();
    result.hull = mask.getConvexHull();
    results.push(result);
    painted.paintMask(mask, {
      origin: roi.origin,
      color: [255, 0, 0, 255],
      out: painted,
    });
  }
  console.log(results);

  const table = (
    <table>
      <tr>
        <th>X</th>
        <th>Y</th>
        <th>Surface</th>
        <th>MBR Width</th>
        <th>MBR Height</th>
      </tr>
      {results.map((result) => (
        <tr>
          <td>{result.origin.column}</td>
          <td>{result.origin.row}</td>
          <td>{result.surface}</td>
          <td>{result.mbr.width}</td>
          <td>{result.mbr.height}</td>
        </tr>
      ))}
    </table>
  );

  // we will calculate all the grey algorithms
  return (
    <div>
      <ImageViewer image={painted} zoom={0.5} />
      {table}
    </div>
  );
}
