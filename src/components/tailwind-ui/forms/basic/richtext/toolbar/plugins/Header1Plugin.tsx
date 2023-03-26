import { TooltipPluginElement } from '../types';

import TextPlugin from './utils/TextPlugin';

export default function Header1Plugin(): TooltipPluginElement {
  return (
    <TextPlugin
      pluginKey="h1"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M4 14V6h1.5v3.25H9V6h1.5v8H9v-3.25H5.5V14Zm10.5 0V7.5h-2V6H16v8Z" />
        </svg>
      }
    />
  );
}
