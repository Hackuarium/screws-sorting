import { createContext } from 'react';

export const DataContext = createContext({
  data: { image: null },
  actions: {},
});

export type SettingsContextType = {
  data: {
    image: {
      maskAlgorithm: '';
      greyAlgorithm: '';
    };
  };
  actions: Record<string, any>;
};
