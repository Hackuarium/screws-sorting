import { produce } from "immer";
import { useContext } from "react";
import { DataContext } from "./DataContext";
import { GlobalContext } from "./GlobalContext";

export default function SetValue() {
  const dataContext = useContext(DataContext);
  const { globalState, setGlobalState } = useContext(GlobalContext);
  return (
    <button
      onClick={() => {
        setValue(globalState, setGlobalState, Math.random());
      }}
    />
  );
}

function setValue(globalState, setGlobalState, value) {
  const result = produce(globalState, (draft) => {
    draft.data.value = value;
  });
  setGlobalState(result);
}
