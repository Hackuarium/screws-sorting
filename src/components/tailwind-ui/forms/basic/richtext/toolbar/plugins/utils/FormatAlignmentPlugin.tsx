import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';
import { ReactNode } from 'react';

import { useRichTextContext } from '../../../context/RichTextContext';
import { RichTextBlockAlignmentType } from '../../../context/RichTextProvider';
import { ToolbarPluginButton } from '../../ToolbarPlugin';
import { useToolbarPluginContext } from '../../toolbarContext';
import { TooltipPluginElement } from '../../types';

interface FormatAlignmentPluginProps {
  pluginKey: RichTextBlockAlignmentType;
  icon: ReactNode;
}

export default function FormatAlignmentPlugin(
  props: FormatAlignmentPluginProps,
): TooltipPluginElement {
  const { pluginKey, icon } = props;

  const toolbarState = useToolbarPluginContext();
  const [editor] = useLexicalComposerContext();
  const [state, dispatch] = useRichTextContext();

  function onClick() {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, pluginKey);
    dispatch({ type: 'CHANGE_ALIGNMENT', payload: pluginKey });
  }

  return (
    <ToolbarPluginButton
      onClick={onClick}
      tooltip={toolbarState.intl[pluginKey]}
      variant={state.blockAlignment === pluginKey ? 'secondary' : 'white'}
    >
      {icon}
    </ToolbarPluginButton>
  );
}
