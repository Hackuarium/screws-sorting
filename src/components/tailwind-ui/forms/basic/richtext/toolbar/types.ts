import { ReactElement } from 'react';

import { RichTextIntl } from './intl';

export interface ToolbarPluginProps {
  formatPlugins?: Array<Plugin>;
  actionPlugins?: Array<Plugin>;
  alignmentPlugins?: Array<Plugin>;
  insertPlugins?: Array<Plugin>;
  intl?: ToolbarPluginContextState['intl'];
}

export type Plugin = ReactElement<{ pluginKey: string }>;

export interface ToolbarPluginElementProps {
  plugins: Array<Plugin>;
}

export interface ToolbarPluginContextState {
  intl: RichTextIntl;
}

export interface ElementToolbarPluginProps {
  tooltip: string;
}

export type TooltipPluginElement = Plugin;
