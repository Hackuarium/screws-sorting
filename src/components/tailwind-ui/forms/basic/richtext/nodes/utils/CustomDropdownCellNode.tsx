import {
  TableCellNode,
  $getTableCellNodeFromLexicalNode,
} from '@lexical/table';
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { useCallback, useEffect, useState } from 'react';

import {
  Dropdown,
  DropdownOption,
} from '../../../../../elements/dropdown/Dropdown';
import { RichTextTableIntl } from '../../toolbar/intl';

import {
  internaldeleteTableColumnAtSelection,
  internalDeleteTableRowAtSelection,
  internalInsertTableColumnAtSelection,
  internalInsertTableRowAtSelection,
} from './TableFunctions';

interface CustomDropdownCellNodeProps {
  editor: LexicalEditor;
  intl: RichTextTableIntl['menu'];
}

type TableActions =
  | 'DELETE_ROW'
  | 'DELETE_COLUMN'
  | 'INSERT_ROW_ABOVE'
  | 'INSERT_ROW_BELOW'
  | 'INSERT_COLUMN_LEFT'
  | 'INSERT_COLUMN_RIGHT';

export function CustomDropdownCellNode(props: CustomDropdownCellNodeProps) {
  const { editor, intl } = props;

  const [tableCellNode, updateTableCellNode] = useState<TableCellNode | null>(
    null,
  );

  const moveMenu = useCallback(() => {
    const selection = $getSelection();
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;
    const rootElement = editor.getRootElement();

    if (
      $isRangeSelection(selection) &&
      rootElement !== null &&
      nativeSelection !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      );

      if (tableCellNodeFromSelection == null) {
        updateTableCellNode(null);
        return;
      }

      const tableCellParentNodeDOM = editor.getElementByKey(
        tableCellNodeFromSelection.getKey(),
      );

      if (tableCellParentNodeDOM == null) {
        updateTableCellNode(null);
        return;
      }

      updateTableCellNode(tableCellNodeFromSelection);
    } else if (!activeElement) {
      updateTableCellNode(null);
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        moveMenu();
      });
    });
  });

  const insertTableColumnAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      return internalInsertTableColumnAtSelection(
        shouldInsertAfter,
        tableCellNode,
        editor,
      );
    },
    [editor, tableCellNode],
  );

  const insertTableRowAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      return internalInsertTableRowAtSelection(
        shouldInsertAfter,
        tableCellNode,
        editor,
      );
    },
    [editor, tableCellNode],
  );

  const deleteTableRowAtSelection = useCallback(() => {
    return internalDeleteTableRowAtSelection(tableCellNode, editor);
  }, [editor, tableCellNode]);

  const deleteTableColumnAtSelection = useCallback(() => {
    return internaldeleteTableColumnAtSelection(tableCellNode, editor);
  }, [editor, tableCellNode]);

  const onSelect = (selection: DropdownOption<TableActions>) => {
    switch (selection.data) {
      case 'DELETE_COLUMN': {
        return deleteTableColumnAtSelection();
      }
      case 'DELETE_ROW': {
        return deleteTableRowAtSelection();
      }
      case 'INSERT_COLUMN_LEFT': {
        return insertTableColumnAtSelection(false);
      }
      case 'INSERT_COLUMN_RIGHT': {
        return insertTableColumnAtSelection(true);
      }
      case 'INSERT_ROW_ABOVE': {
        return insertTableRowAtSelection(false);
      }
      case 'INSERT_ROW_BELOW': {
        return insertTableRowAtSelection(true);
      }
      default:
        throw new Error('unreachable');
    }
  };

  return (
    <Dropdown<TableActions>
      className="invisible absolute right-0 top-0 mr-2 group-hover:visible"
      noDefaultButtonStyle
      onSelect={onSelect}
      options={[
        [
          {
            type: 'option',
            label: intl.insertRowAbv,
            data: 'INSERT_ROW_ABOVE',
          },
          {
            type: 'option',
            label: intl.insertRowBlv,
            data: 'INSERT_ROW_BELOW',
          },
        ],
        [
          {
            type: 'option',
            label: intl.insertColLeft,
            data: 'INSERT_COLUMN_LEFT',
          },
          {
            type: 'option',
            label: intl.insertColRight,
            data: 'INSERT_COLUMN_RIGHT',
          },
        ],
        [
          { type: 'option', label: intl.deleteCol, data: 'DELETE_COLUMN' },
          { type: 'option', label: intl.deleteRow, data: 'DELETE_ROW' },
        ],
      ]}
      placement="right"
    />
  );
}
