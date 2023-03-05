import { writeCanvas } from "image-js";

import { useContext, useEffect, useRef } from "react";

import { Context } from "./DataContext";

function ImageViewer() {
  const context = useContext(Context);

  const imageRef = useRef(null);

  useEffect(() => {
    console.log({ context });
    writeCanvas(context.image, imageRef.current);
  }, [imageRef, context]);

  return (
    <div style={{ zoom: 0.1 }}>
      <canvas ref={imageRef}></canvas>
    </div>
  );
}

export default ImageViewer;
