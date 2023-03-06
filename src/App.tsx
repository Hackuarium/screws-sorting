import { useState } from 'react';
import './App.css';

import { defaultDataValue, getDataActions } from './Data';
import { DataContext } from './DataContext';
import { GlobalContext } from './GlobalContext';
import LoadImage from './LoadImage';
import MyTabs from './MyTabs';
import Test from './WebcamWrapper';

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
          <MyTabs />
        </div>
      </DataContext.Provider>
    </GlobalContext.Provider>
  );
}

export default App;
