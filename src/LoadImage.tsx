import { useContext } from 'react';

import { DataContext } from './DataContext';

export default function LoadImage() {
  const dataContext = useContext(DataContext);

  return (
    <select
      //@ts-expect-error should be fixed
      onChange={(event) => dataContext.actions.loadImage(event.target.value)}
    >
      <option value="" />
      <option value="/test/good.jpg">good.jpg</option>
      <option value="/test/redDots.jpg">redDots.jpg</option>
      <option value="/test/overlap.jpg">overlap.jpg</option>
    </select>
  );
}
