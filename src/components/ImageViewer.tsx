import { Image, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

export default function ImageViewer(props: { image: Image; zoom?: number }) {
  const { image, zoom = 0.1 } = props;
  const imageRef = useRef(null);

  useEffect(() => {
    if (!image) return;
    writeCanvas(image, imageRef.current);
  }, [imageRef, image]);

  return (
    <div style={{ zoom }}>
      <canvas ref={imageRef} />
    </div>
  );
}
