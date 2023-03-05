import { Image, GreyAlgorithms } from 'image-js';

import ImageViewer from '../ImageViewer';

export default function ExploreGrey(props: { image: Image }) {
  const { image } = props;

  if (!image) {
    return '<div>No selected image</div>';
  }

  if (image.colorModel !== 'RGB' && image.colorModel !== 'RGBA') {
    return <div>This is a grey image, no need to explore</div>;
  }

  const smallImage = image.resize({ width: 400 });

  // todo should be exposed by image-js

  const algorithms: GreyAlgorithms[] = [
    'luma709',
    'luma601',
    'max',
    'min',
    'average',
    'minmax',
    'red',
    'green',
    'blue',
    'black',
    'cyan',
    'magenta',
    'yellow',
    'hue',
    'saturation',
    'lightness',
  ];
  const greyImages: { algorithm: GreyAlgorithms; image: Image }[] = [];
  for (let algorithm of algorithms) {
    greyImages.push({ algorithm, image: smallImage.grey({ algorithm }) });
  }

  // we will calculate all the grey algorithms
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {greyImages.map((data) => (
        <div key={data.algorithm}>
          <div>{data.algorithm}</div>
          <ImageViewer image={data.image} zoom={0.5} />
        </div>
      ))}
    </div>
  );
}
