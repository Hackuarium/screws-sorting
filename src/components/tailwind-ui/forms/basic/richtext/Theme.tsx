import { EditorThemeClasses } from 'lexical';

// Add CSS class to the selected key (in toolbar plugin)
export default {
  paragraph: 'text-base mb-2',
  image: 'cursor-default inline-block relative',
  heading: {
    h1: 'text-2xl mt-4 mb-2',
    h2: 'text-xl mt-4 mb-2',
    h3: 'text-lg mt-4 mb-2',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    strikethrough: 'line-through',
    underline: 'underline',
  },
  list: {
    ul: 'list-disc ml-5',
    ol: 'list-decimal ml-5',
  },
  table:
    'inline-block border-neutral-200 align-middle shadow divide-y divide-neutral-200',
  tableCell:
    'whitespace-nowrap text-sm border-neutral-200 px-6 py-4 [&>p]:mb-0',
  tableCellHeader:
    'border-neutral-200 text-left text-xs font-semibold uppercase',
  tableRow: 'divide-x divide-neutral-200',
} as EditorThemeClasses;
