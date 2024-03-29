import { TooltipPluginElement } from '../types';

import TextPlugin from './utils/TextPlugin';

export default function Header2Plugin(): TooltipPluginElement {
  return (
    <TextPlugin
      pluginKey="h2"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M3 14V6h1.5v3.25H8V6h1.5v8H8v-3.25H4.5V14Zm8 0v-3.25q0-.625.438-1.062.437-.438 1.062-.438h3V7.5H11V6h4.5q.625 0 1.062.438Q17 6.875 17 7.5v1.75q0 .625-.438 1.062-.437.438-1.062.438h-3v1.75H17V14Z" />
        </svg>
      }
    />
  );
}
