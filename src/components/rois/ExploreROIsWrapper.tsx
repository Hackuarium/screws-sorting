import { useContext } from 'react';

import { DataContext } from '../../DataContext';

import ExploreROIs from './ExploreROIs';

export default function ExploreROIsWrapper() {
  const dataContext = useContext(DataContext);

  return <ExploreROIs image={dataContext.data.image} />;
}
