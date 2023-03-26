import { Image, Roi, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

import RoiAnnotations from './rois/RoiAnnotations';

export default function ImageViewer(props: {
  image: Image;
  zoom?: number;
  rois?: Roi[];
  roiOptions?: any;
}) {
  const { image, zoom = 0.1, rois, roiOptions } = props;
  const imageRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current);
  }, [imageRef, image]);

  return (
    <div style={{ zoom, position: 'relative' }}>
      <canvas ref={imageRef} />

      <RoiAnnotations
        width={image?.width}
        height={image?.height}
        rois={rois}
        roiOptions={roiOptions}
      />
    </div>
  );
}
