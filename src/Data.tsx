import { decode } from 'image-js';
import { produce } from 'immer';

export const defaultDataValue = {
  value: 'Hello World',
  image: undefined,
};

export function getDataActions(globalState, setGlobalState) {
  return {
    setValue: (value) => {
      setGlobalState(
        produce((draft) => {
          draft.data.value = value;
        }),
      );
    },

    loadImage: async (imageName = '/test/good.jpg') => {
      const response = await fetch(imageName);
      const arrayBuffer = await response.arrayBuffer();
      // TODO: I would prefer to directly use the arrayBuffer here
      const image = decode(new Uint8Array(arrayBuffer));
      setGlobalState(
        produce((draft) => {
          draft.data.image = image;
        }),
      );
    },
  };
}
