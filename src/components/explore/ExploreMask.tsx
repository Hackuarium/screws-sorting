import { Image, Mask, ThresholdAlgorithm } from 'image-js';

import MaskViewer from '../MaskViewer';

export default function ExploreMask(props: { image: Image }) {
  let { image } = props;

  if (!image) {
    return <div>No selected image</div>;
  }

  if (image.channels > 1) {
    image = image.grey();
  }

  const smallImage = image.resize({ width: 400 });

  // todo should be exposed by image-js

  const binaryImages: { algorithm: string; mask: Mask }[] = [];
  for (let algorithm in ThresholdAlgorithm) {
    binaryImages.push({
      algorithm,
      // @ts-expect-error Should be simple to solve
      mask: smallImage.threshold({ algorithm }),
    });
  }

  // we will calculate all the grey algorithms
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {binaryImages.map((data) => (
        <div key={data.algorithm}>
          <div>{data.algorithm}</div>
          <MaskViewer mask={data.mask} zoom={0.5} />
        </div>
      ))}
    </div>
  );
}
