import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ReactNode } from 'react';

import { useRichTextContext } from '../../../context/RichTextContext';
import { ToolbarPluginButton } from '../../ToolbarPlugin';
import { useToolbarPluginContext } from '../../toolbarContext';
import { TooltipPluginElement } from '../../types';

interface FormatPluginProps {
  pluginKey: 'ul' | 'ol';
  icon: ReactNode;
}

export default function ListPlugin(
  props: FormatPluginProps,
): TooltipPluginElement {
  const { pluginKey, icon } = props;

  const toolbarState = useToolbarPluginContext();
  const [editor] = useLexicalComposerContext();
  const [state] = useRichTextContext();

  function onClick() {
    if (state.blockType === pluginKey) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(
        pluginKey === 'ul'
          ? INSERT_UNORDERED_LIST_COMMAND
          : INSERT_ORDERED_LIST_COMMAND,
        undefined,
      );
    }
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
