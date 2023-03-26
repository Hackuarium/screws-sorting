import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 3840,
  height: 2160,
  //  facingMode: 'user',
};

export default function WebcamWrapper(props) {
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        height={2160}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={3840}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
    </>
  );
}
