import { TooltipPluginElement } from '../types';

import TextPlugin from './utils/TextPlugin';

export default function ParagraphPlugin(): TooltipPluginElement {
  return (
    <TextPlugin
      pluginKey="paragraph"
      icon={
        <svg height="20" width="20">
          <text x="5" y="15" className="font-bold">
            N
          </text>
        </svg>
      }
    />
  );
}
