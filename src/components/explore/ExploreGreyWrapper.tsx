import { useContext } from 'react';

import { DataContext } from '../../DataContext';

import ExploreGrey from './ExploreGrey';

export default function ExploreGreyWrapper() {
  const dataContext = useContext(DataContext);

  return <ExploreGrey image={dataContext.data.image} />;
}
