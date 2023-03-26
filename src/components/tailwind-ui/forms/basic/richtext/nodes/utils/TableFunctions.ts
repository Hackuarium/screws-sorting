import {
  TableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $getTableColumnIndexFromTableCellNode,
  $getElementGridForTableNode,
  $insertTableRow,
  $insertTableColumn,
  $removeTableRowAtIndex,
  $deleteTableColumn,
} from '@lexical/table';
import { LexicalEditor } from 'lexical';

export function internalInsertTableRowAtSelection(
  shouldInsertAfter: boolean,
  tableCellNode: TableCellNode | null,
  editor: LexicalEditor,
) {
  if (tableCellNode === null) return;

  editor.update(() => {
    const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
    const grid = $getElementGridForTableNode(editor, tableNode);

    $insertTableRow(
      tableNode,
      $getTableRowIndexFromTableCellNode(tableCellNode),
      shouldInsertAfter,
      1,
      grid,
    );
  });
}

export function internalInsertTableColumnAtSelection(
  shouldInsertAfter: boolean,
  tableCellNode: TableCellNode | null,
  editor: LexicalEditor,
) {
  if (tableCellNode === null) return;

  editor.update(() => {
    const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
    const grid = $getElementGridForTableNode(editor, tableNode);

    $insertTableColumn(
      tableNode,
      $getTableColumnIndexFromTableCellNode(tableCellNode),
      shouldInsertAfter,
      1,
      grid,
    );
  });
}

export function internalDeleteTableRowAtSelection(
  tableCellNode: TableCellNode | null,
  editor: LexicalEditor,
) {
  if (tableCellNode === null) return;
  editor.update(() => {
    const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
    const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

    $removeTableRowAtIndex(tableNode, tableRowIndex);
  });
}

export function internaldeleteTableColumnAtSelection(
  tableCellNode: TableCellNode | null,
  editor: LexicalEditor,
) {
  if (tableCellNode === null) return;

  editor.update(() => {
    const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

    const tableColumnIndex =
      $getTableColumnIndexFromTableCellNode(tableCellNode);

    $deleteTableColumn(tableNode, tableColumnIndex);
  });
}
