import { ListItemNode, ListNode } from '@lexical/list';
import { InitialConfigType } from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { useMemo } from 'react';

import { RichTextIntl } from '../toolbar/intl';

import { CustomTableCellNode } from './CustomTableCellNode';
import { ImageNode } from './ImageNode';

export function useNodes(intl: RichTextIntl) {
  return useMemo<InitialConfigType['nodes']>(() => {
    return [
      HeadingNode,
      ListNode,
      ListItemNode,
      TableCellNode,
      TableNode,
      TableRowNode,
      ImageNode,
      CustomTableCellNode,
      {
        replace: TableCellNode,
        with: (node) => {
          return new CustomTableCellNode(
            node.__headerState,
            node.__colSpan,
            intl.table,
            node.__width,
          );
        },
      },
    ];
  }, [intl]);
}
