import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import { ReactNode } from 'react';

import { useRichTextContext } from '../../../context/RichTextContext';
import { RichTextFormatType } from '../../../context/RichTextProvider';
import { ToolbarPluginButton } from '../../ToolbarPlugin';
import { RichTextIntl } from '../../intl';
import { useToolbarPluginContext } from '../../toolbarContext';
import { TooltipPluginElement } from '../../types';

interface FormatPluginProps {
  pluginKey: string;
  icon: ReactNode;
}

export default function FormatPlugin(
  props: FormatPluginProps,
): TooltipPluginElement {
  const { pluginKey, icon } = props;

  const toolbarState = useToolbarPluginContext();
  const [editor] = useLexicalComposerContext();
  const [state, dispatch] = useRichTextContext();

  function onClick() {
    const textFormatKey = pluginKey as TextFormatType;
    const richTextFormatKey = pluginKey as RichTextFormatType;

    editor.dispatchCommand(FORMAT_TEXT_COMMAND, textFormatKey);

    dispatch({
      type: 'CHANGE_TOOLBAR',
      payload: {
        type: richTextFormatKey,
        value: !state[richTextFormatKey],
      },
    });
  }

  const tooltip = toolbarState.intl[pluginKey as keyof RichTextIntl];

  return (
    <ToolbarPluginButton
      onClick={onClick}
      tooltip={tooltip as string}
      variant={!state[pluginKey as RichTextFormatType] ? 'white' : 'secondary'}
    >
      {icon}
    </ToolbarPluginButton>
  );
}
