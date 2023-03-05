import { useContext } from 'react';

import { DataContext } from '../../DataContext';

import ExploreMask from './ExploreMask';

export default function ExploreMaskWrapper() {
  const dataContext = useContext(DataContext);

  return <ExploreMask image={dataContext.data.image} />;
}
