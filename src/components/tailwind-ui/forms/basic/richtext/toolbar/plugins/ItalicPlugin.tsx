import { TooltipPluginElement } from '../types';

import FormatPlugin from './utils/FormatPlugin';

export default function ItalicPlugin(): TooltipPluginElement {
  return (
    <FormatPlugin
      pluginKey="italic"
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
          <path d="M5 16v-2h2.375l3.187-8H8V4h7v2h-2.271l-3.208 8H12v2Z" />
        </svg>
      }
    />
  );
}
