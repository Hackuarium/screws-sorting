import { createContext, useContext } from 'react';

import { EmptyValue } from '../../util';

interface RHFConfig {
  emptyValue: EmptyValue;
}

export const configContext = createContext<RHFConfig | null>(null);

export function useRHFConfig() {
  const value = useContext(configContext);

  if (value === null) {
    throw new Error(
      'missing RHF config value, make sure to call useRHFConfig in a descendant of FormRHF',
    );
  }

  return value;
}
