import { createStepArray, xyToXYObject } from 'ml-spectra-processing';
import { useContext } from 'react';
import { Plot, BarSeries, Axis, Heading } from 'react-plot';

import { DataContext } from './DataContext';
import ImageViewer from './components/ImageViewer';

export default function ImageViewerWrapper() {
  const dataContext = useContext(DataContext);

  if (!dataContext.data?.image) return null;

  return (
    <>
      <ImageViewer image={dataContext.data.image} />
      <ImageInfo image={dataContext.data.image} />
      <ImageHistograms image={dataContext.data.image} />
    </>
  );
}

function ImageInfo(props) {
  const { image } = props;
  return (
    <>
      <div>
        Image: {image.width} x {image.height} ({image.size} pixels)
      </div>
      <div>Channels: {image.channels}</div>
      <div>Alpha: {image.alpha ? 'Yes' : 'No'}</div>
      <div>Depth: {image.depth} bits</div>
    </>
  );
}

function ImageHistograms(props) {
  const { image } = props;
  const plots = [];
  for (let channel = 0; channel < image.channels; channel++) {
    const histogram = image.histogram({ channel });
    const xy = xyToXYObject({
      x: createStepArray({ length: histogram.length }),
      y: histogram,
    });
    plots.push(
      <Plot key={channel} width={300} height={300}>
        <Heading title={`Channel: ${channel}`} />
        <BarSeries data={xy} />
        <BarSeries
          data={[
            { x: 1, y: 0 },
            { x: 3, y: 5 },
            { x: 5, y: 2 },
          ]}
        />
        <Axis
          id="x"
          position="bottom"
          label="Pixel intensity"
          displayPrimaryGridLines
        />
        <Axis
          id="y"
          position="left"
          label="Number of pixels"
          displayPrimaryGridLines
        />
      </Plot>,
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>{plots}</div>
    </div>
  );
}
