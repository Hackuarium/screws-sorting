import { useContext } from 'react';
import { ObjectInspector } from 'react-inspector';

import { GlobalContext } from '../../GlobalContext';

export default function ObjectInspectorWrapper() {
  const globalState = useContext(GlobalContext);
  return <ObjectInspector expandLevel={2} data={globalState} />;
}
