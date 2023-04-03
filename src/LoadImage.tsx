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
          label: 'redDots.jpg',
          value: '/test/redDots.jpg',
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
          label: 'screwTags.jpg',
          value: '/test/screwTags.jpg',
        },
        {
          label: 'bwTags.jpg',
          value: '/test/bwTags.jpg',
        },
        {
          label: 'bwTags2.jpg',
          value: '/test/bwTags2.jpg',
        },
        {
          label: 'optimal.jpg',
          value: '/test/optimal.jpg',
        },
      ]}
      placeholder="Select an image..."
    />
  );
}
