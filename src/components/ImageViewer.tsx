import { Image, Roi, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';
import { MapInteractionCSS } from 'react-map-interaction';

import RoiAnnotations from './rois/RoiAnnotations';

export default function ImageViewer(props: {
  image: Image;
  rois?: Roi[];
  roiOptions?: any;
}) {
  const { image, rois, roiOptions } = props;
  const imageRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current);
  }, [imageRef, image]);

  return (
    <MapInteractionCSS>
      <div style={{ position: 'relative' }}>
        <canvas ref={imageRef} />

        <RoiAnnotations
          width={image?.width}
          height={image?.height}
          rois={rois}
          roiOptions={roiOptions}
        />
      </div>
    </MapInteractionCSS>
  );
}
