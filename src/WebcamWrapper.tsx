import { useRef, useCallback, useContext } from 'react';
import Webcam from 'react-webcam';

import { DataContext, DataContextType } from './DataContext';

const videoConstraints = {
  width: 3840,
  height: 2160,
  //  facingMode: 'user',
};

export default function WebcamWrapper() {
  const dataContext: DataContextType = useContext(DataContext);
  const webcamRef = useRef(null);
  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    dataContext.actions.loadURL(imageSrc);
  }, [webcamRef, dataContext.actions]);

  return (
    <>
      <Webcam
        audio={false}
        width={3840}
        height={2160}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        minScreenshotWidth={3840}
        minScreenshotHeight={2160}
        forceScreenshotSourceSize
        videoConstraints={videoConstraints}
      />
      <button type="button" onClick={capture}>
        Capture photo
      </button>
    </>
  );
}
