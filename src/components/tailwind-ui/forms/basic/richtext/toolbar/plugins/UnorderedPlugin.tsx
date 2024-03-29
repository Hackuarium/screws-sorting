import { TooltipPluginElement } from '../types';

import ListPlugin from './utils/ListPlugin';

export default function UnorderedPlugin(): TooltipPluginElement {
  return (
    <ListPlugin
      pluginKey="ul"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M3.5 15.25q-.417 0-.708-.292-.292-.291-.292-.708t.292-.708q.291-.292.708-.292t.708.292q.292.291.292.708t-.292.708q-.291.292-.708.292ZM6 15v-1.5h11V15Zm-2.5-4q-.417 0-.708-.292Q2.5 10.417 2.5 10t.292-.708Q3.083 9 3.5 9t.708.292q.292.291.292.708t-.292.708Q3.917 11 3.5 11Zm2.5-.25v-1.5h11v1.5Zm-2.5-4q-.417 0-.708-.292Q2.5 6.167 2.5 5.75t.292-.708q.291-.292.708-.292t.708.292q.292.291.292.708t-.292.708q-.291.292-.708.292ZM6 6.5V5h11v1.5Z" />
        </svg>
      }
    />
  );
}
