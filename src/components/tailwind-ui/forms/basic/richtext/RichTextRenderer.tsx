import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { SerializedEditorState } from 'lexical';
import { useEffect, useMemo } from 'react';

import Theme from './Theme';
import { RichTextProvider } from './context/RichTextProvider';
import { useNodes } from './nodes/RichTextNodes';
import defaultIntl from './toolbar/intl';

interface RichTextRendererProps {
  state: string | SerializedEditorState;
}

export function RichTextRenderer(props: RichTextRendererProps) {
  const { state } = props;

  const internalState = useMemo(() => {
    return JSON.stringify(state);
  }, [state]);

  return (
    <RichTextProvider>
      <LexicalComposer
        initialConfig={{
          namespace: 'RichTextRendered',
          theme: Theme,
          nodes: useNodes(defaultIntl),
          onError: () => {},
          editorState: internalState,
          editable: false,
        }}
      >
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <RichTextUpdatePlugin state={state} />
      </LexicalComposer>
    </RichTextProvider>
  );
}

function RichTextUpdatePlugin(props: RichTextRendererProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditorState(editor.parseEditorState(props.state));
  }, [editor, props.state]);

  return null;
}
