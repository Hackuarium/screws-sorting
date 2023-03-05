import { Image, ImageColorModel, Mask, writeCanvas } from 'image-js';
import { useEffect, useRef } from 'react';

export default function ImageViewer(props: { mask: Mask; zoom?: number }) {
  const { mask, zoom = 0.1 } = props;
  const imageRef = useRef(null);

  useEffect(() => {
    if (!mask) return;
    writeCanvas(mask.convertColor(ImageColorModel.GREY), imageRef.current);
  }, [imageRef, mask]);

  return (
    <div style={{ zoom }}>
      <canvas ref={imageRef} />
    </div>
  );
}
