import { decode } from 'image-js';
import { produce } from 'immer';

export const defaultDataValue = {
  image: undefined,
};

export function getDataActions(globalState, setGlobalState) {
  return {
    loadImage: async (imageName = '/test/good.jpg') => {
      const response = await fetch(imageName);
      const arrayBuffer = await response.arrayBuffer();
      // TODO: I would prefer to directly use the arrayBuffer here
      const image = decode(new Uint8Array(arrayBuffer));
      setGlobalState(
        produce((draft: any) => {
          draft.data.image = image;
        }),
      );
    },

    loadURL: async (dataURL) => {
      const response = await fetch(dataURL);
      const arrayBuffer = await response.arrayBuffer();
      const image = decode(new Uint8Array(arrayBuffer));
      setGlobalState(
        produce((draft: any) => {
          draft.data.image = image;
        }),
      );
    },
  };
}
