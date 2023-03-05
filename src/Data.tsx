import { produce } from "immer";

export const defaultDataValue = {
  value: "Hello World",
  image: undefined,
};

export function getDataActions(globalState, setGlobalState) {
  return {
    setValue: (value) => {
      const result = produce(globalState, (draft) => {
        draft.data.value = value;
      });
      setGlobalState(result);
    },
  };
}
