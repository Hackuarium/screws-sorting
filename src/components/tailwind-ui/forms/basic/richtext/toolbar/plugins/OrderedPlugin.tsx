import { TooltipPluginElement } from '../types';

import ListPlugin from './utils/ListPlugin';

export default function OrderedPlugin(): TooltipPluginElement {
  return (
    <ListPlugin
      pluginKey="ol"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M2 16v-.75h1.5v-.375h-.75v-.75h.75v-.375H2V13h2.25v3Zm4-1v-1.5h11V15Zm-4-3.5v-.667L3.354 9.25H2V8.5h2.25v.667L2.896 10.75H4.25v.75Zm4-.75v-1.5h11v1.5ZM2.75 7V4.75H2V4h1.5v3ZM6 6.5V5h11v1.5Z" />
        </svg>
      }
    />
  );
}
