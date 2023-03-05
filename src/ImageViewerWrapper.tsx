import { useContext } from 'react';

import { DataContext } from './DataContext';
import ImageViewer from './components/ImageViewer';

export default function ImageViewerWrapper() {
  const dataContext = useContext(DataContext);

  return <ImageViewer image={dataContext.data.image} />;
}
