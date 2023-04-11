import { useContext, useState } from 'react';

import { DataContext, DataContextType } from './DataContext';
import { Button, Input, Select } from './components/tailwind-ui';

export default function LoadImage() {
  const dataContext: DataContextType = useContext(DataContext);

  const [imageURL, setImageURL] = useState(
    localStorage.getItem('imageURL') || 'https://picsum.photos/1600/2400',
  );

  return (
    <div className="flex">
      <Select
        className="w-1/2"
        label="Predefined list of images"
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
      <Input
        className="w-2/6"
        name="imageURL"
        label="Or enter an image URL..."
        type="text"
        value={imageURL}
        onChange={(event) => {
          localStorage.setItem('imageURL', event.target.value);
          setImageURL(event.target.value);
        }}
      />
      <Button
        className="w-1/6"
        value="Load"
        onClick={() => dataContext.actions.loadImage(imageURL)}
      >
        Load image
      </Button>
    </div>
  );
}
