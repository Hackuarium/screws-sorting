import { TableCellNode, SerializedTableCellNode } from '@lexical/table';
import { EditorConfig, LexicalEditor, NodeKey } from 'lexical';
import { render } from 'react-dom';

import defaultIntl, { RichTextTableIntl } from '../toolbar/intl';

import { CustomDropdownCellNode } from './utils/CustomDropdownCellNode';

export class CustomTableCellNode extends TableCellNode {
  private intl: RichTextTableIntl;

  public constructor(
    headerState: number,
    colSpan: number,
    intl: RichTextTableIntl,
    width?: number,
    key?: NodeKey,
  ) {
    super(headerState, colSpan, width, key);
    this.intl = intl;
  }

  public static getType(): string {
    return 'zakodium-tablecell';
  }

  public static clone(node: TableCellNode): TableCellNode {
    return new CustomTableCellNode(
      node.__headerState,
      node.__colSpan,
      defaultIntl.table,
      node.__width,
      node.__key,
    );
  }

  public createDOM(config: EditorConfig, _editor?: LexicalEditor): HTMLElement {
    const dom = super.createDOM(config);
    dom.classList.add('group', 'relative');

    if (_editor) {
      render(
        <CustomDropdownCellNode editor={_editor} intl={this.intl.menu} />,
        dom,
      );
    }

    return dom;
  }

  public exportJSON(): SerializedTableCellNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      version: 1,
    };
  }
}
