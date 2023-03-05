import { useState } from "react";
import "./App.css";
import { ObjectInspector } from "react-inspector";
import { ActionsContext } from "./ActionsContext";
import { DataContext } from "./DataContext";
import { loadImage } from "./loadGoodImage";
import ImageViewer from "./ImageViewer";
import Demo from "./Demo";
import SetValue from "./SetValue";
import { defaultDataValue, getDataActions } from "./Data";
import { GlobalContext } from "./GlobalContext";

function App() {
  const [globalState, setGlobalState] = useState({
    data: defaultDataValue,
    view: {},
    settings: {},
  });

  const actions = getDataActions(globalState, setGlobalState);

  return (
    <GlobalContext.Provider value={{ globalState, setGlobalState }}>
      <DataContext.Provider
        value={{ data: globalState.data, actions: actions }}
      >
        <div>
          <ObjectInspector expandLevel={2} data={globalState} />
          <div className="App">Hello world</div>
          <Demo></Demo>
        </div>
        <SetValue></SetValue>
      </DataContext.Provider>
    </GlobalContext.Provider>
  );
}

export default App;
