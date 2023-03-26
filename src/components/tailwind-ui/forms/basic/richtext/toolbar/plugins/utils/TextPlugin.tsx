import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { ReactNode } from 'react';

import { useRichTextContext } from '../../../context/RichTextContext';
import { ToolbarPluginButton } from '../../ToolbarPlugin';
import { useToolbarPluginContext } from '../../toolbarContext';
import { TooltipPluginElement } from '../../types';

interface TextPluginProps {
  pluginKey: 'h1' | 'h2' | 'h3' | 'paragraph';
  icon: ReactNode;
}

export default function TextPlugin(
  props: TextPluginProps,
): TooltipPluginElement {
  const { icon, pluginKey } = props;

  const toolbarState = useToolbarPluginContext();
  const [editor] = useLexicalComposerContext();
  const [state] = useRichTextContext();

  function onClick() {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          pluginKey === 'paragraph'
            ? $createParagraphNode()
            : $createHeadingNode(pluginKey),
        );
      }
    });
  }

  return (
    <ToolbarPluginButton
      onClick={onClick}
      tooltip={toolbarState.intl[pluginKey]}
      variant={state.blockType === pluginKey ? 'secondary' : 'white'}
    >
      {icon}
    </ToolbarPluginButton>
  );
}
