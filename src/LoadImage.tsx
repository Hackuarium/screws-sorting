import { useContext } from 'react';

import { DataContext, DataContextType } from './DataContext';
import { Select } from './components/tailwind-ui';

export default function LoadImage() {
  const dataContext: DataContextType = useContext(DataContext);

  return (
    <Select
      size="medium"
      onSelect={(event) => {
        dataContext.actions.loadImage(event.value);
      }}
      options={[
        {
          label: 'good.jpg',
          value: '/test/good.jpg',
        },
        {
          label: 'overlap.jpg',
          value: '/test/overlap.jpg',
        },
        {
          label: 'colorTags.jpg',
          value: '/test/colorTags.jpg',
        },
        {
          label: 'optimal.jpg',
          value: '/test/optimal.jpg',
        },
        {
          label: 'real1.jpg',
          value: '/test/real1.jpg',
        },
        {
          label: 'real2.jpg',
          value: '/test/real2.jpg',
        },
        {
          label: 'real3.jpg',
          value: '/test/real3.jpg',
        },
        {
          label: 'real4.jpg',
          value: '/test/real4.jpg',
        },
      ]}
      placeholder="Select an image..."
    />
  );
}
