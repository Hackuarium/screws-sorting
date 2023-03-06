import { createContext } from 'react';

export const DataContext = createContext({
  data: { image: null },
  actions: {},
});

export type DataContextType = {
  data: {
    image: any;
  };
  actions: Record<string, any>;
};
