import { useState } from 'react';
import './App.css';
import { ObjectInspector } from 'react-inspector';

import { defaultDataValue, getDataActions } from './Data';
import { DataContext } from './DataContext';
import { GlobalContext } from './GlobalContext';
import ImageViewerWrapper from './ImageViewerWrapper';
import LoadImage from './LoadImage';
import ExploreGreyWrapper from './components/explore/ExploreGreyWrapper';
import ExploreMaskWrapper from './components/explore/ExploreMaskWrapper';

function App() {
  const [globalState, setGlobalState] = useState({
    data: defaultDataValue,
    view: {},
    settings: {},
  });

  const actions = getDataActions(globalState, setGlobalState);

  return (
    <GlobalContext.Provider value={{ globalState, setGlobalState }}>
      <DataContext.Provider value={{ data: globalState.data, actions }}>
        <div>
          <LoadImage />
          <ImageViewerWrapper />
          <ExploreGreyWrapper />
          <ExploreMaskWrapper />
          <ObjectInspector expandLevel={2} data={globalState} />
        </div>
      </DataContext.Provider>
    </GlobalContext.Provider>
  );
}

export default App;
