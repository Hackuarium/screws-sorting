import { TooltipPluginElement } from '../types';

import TextPlugin from './utils/TextPlugin';

export default function Header3Plugin(): TooltipPluginElement {
  return (
    <TextPlugin
      pluginKey="h3"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M3 14V6h1.5v3.25H8V6h1.5v8H8v-3.25H4.5V14Zm8 0v-1.5h4.5v-1.75H12v-1.5h3.5V7.5H11V6h4.5q.625 0 1.062.438Q17 6.875 17 7.5v5q0 .625-.438 1.062Q16.125 14 15.5 14Z" />
        </svg>
      }
    />
  );
}
