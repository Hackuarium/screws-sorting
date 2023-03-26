import { TooltipPluginElement } from '../types';

import FormatPlugin from './utils/FormatPlugin';

export default function SuperscriptPlugin(): TooltipPluginElement {
  return (
    <FormatPlugin
      pluginKey="superscript"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M15 8V6q0-.417.292-.708Q15.583 5 16 5h1V4h-2V3h2q.417 0 .708.292Q18 3.583 18 4v1q0 .417-.292.708Q17.417 6 17 6h-1v1h2v1Zm-9.375 8 3.313-5.208L5.854 6H7.75l2.208 3.562h.084L12.25 6h1.896l-3.104 4.792L14.375 16h-1.896l-2.437-3.875h-.084L7.521 16Z" />
        </svg>
      }
    />
  );
}
