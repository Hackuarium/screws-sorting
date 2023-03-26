import { TooltipPluginElement } from '../types';

import FormatPlugin from './utils/FormatPlugin';

export default function SubscriptPlugin(): TooltipPluginElement {
  return (
    <FormatPlugin
      pluginKey="subscript"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M15 17v-2q0-.417.292-.708Q15.583 14 16 14h1v-1h-2v-1h2q.417 0 .708.292.292.291.292.708v1q0 .417-.292.708Q17.417 15 17 15h-1v1h2v1Zm-9.375-3 3.313-5.208L5.854 4H7.75l2.208 3.562h.084L12.25 4h1.896l-3.104 4.792L14.375 14h-1.896l-2.437-3.875h-.084L7.521 14Z" />
        </svg>
      }
    />
  );
}
