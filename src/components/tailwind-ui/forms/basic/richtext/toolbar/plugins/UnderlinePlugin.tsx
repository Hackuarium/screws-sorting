import { TooltipPluginElement } from '../types';

import FormatPlugin from './utils/FormatPlugin';

export default function UnderlinePlugin(): TooltipPluginElement {
  return (
    <FormatPlugin
      pluginKey="underline"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M4.167 17v-1.5h11.666V17ZM10 14q-1.896 0-3.198-1.302T5.5 9.5V3h2v6.5q0 1.042.729 1.771Q8.958 12 10 12q1.042 0 1.771-.729.729-.729.729-1.771V3h2v6.5q0 1.896-1.302 3.198T10 14Z" />
        </svg>
      }
    />
  );
}
