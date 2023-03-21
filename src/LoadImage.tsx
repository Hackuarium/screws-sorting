import { useContext } from 'react';

import { DataContext } from './DataContext';
import { Dropdown, Select } from './components/tailwind-ui';

export default function LoadImage() {
  const dataContext = useContext(DataContext);

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
      ]}
      placeholder="Select an image..."
    />
  );
}
