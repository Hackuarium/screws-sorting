import { createContext, useContext } from 'react';

import { ToolbarPluginContextState } from './types';

export const toolbarContext = createContext<ToolbarPluginContextState | null>(
  null,
);

export function useToolbarPluginContext() {
  const ctx = useContext(toolbarContext);

  if (!ctx) {
    throw new Error('ToolbarPluginContext not found');
  }

  return ctx;
}
