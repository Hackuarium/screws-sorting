import {
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import clsx from 'clsx';
import { EditorState, LexicalEditor } from 'lexical';
import { useEffect } from 'react';

import { Help } from '../common';

import Theme from './Theme';
import { RichTextProvider } from './context/RichTextProvider';
import { useNodes } from './nodes/RichTextNodes';
import { ImagesPlugin } from './plugins/ImagesPlugin';
import { ToolbarPlugin } from './toolbar/ToolbarPlugin';
import defaultIntl, {
  RichTextIntl as InternalRichTextIntl,
} from './toolbar/intl';
import BoldPlugin from './toolbar/plugins/BoldPlugin';
import CenterAlignmentPlugin from './toolbar/plugins/CenterAlignmentPlugin';
import ColorPickerPlugin from './toolbar/plugins/ColorPickerPlugin';
import Header1Plugin from './toolbar/plugins/Header1Plugin';
import Header2Plugin from './toolbar/plugins/Header2Plugin';
import Header3Plugin from './toolbar/plugins/Header3Plugin';
import InternalImagePlugin from './toolbar/plugins/ImagePlugin';
import ItalicPlugin from './toolbar/plugins/ItalicPlugin';
import JustifyAlignmentPlugin from './toolbar/plugins/JustifyAlignmentPlugin';
import LeftAlignmentPlugin from './toolbar/plugins/LeftAlignmentPlugin';
import OrderedPlugin from './toolbar/plugins/OrderedPlugin';
import ParagraphPlugin from './toolbar/plugins/ParagraphPlugin';
import RightAlignmentPlugin from './toolbar/plugins/RightAlignmentPlugin';
import SubscriptPlugin from './toolbar/plugins/SubscriptPlugin';
import SuperscriptPlugin from './toolbar/plugins/SuperscriptPlugin';
import InternalTablePlugin from './toolbar/plugins/TablePlugin';
import UnderlinePlugin from './toolbar/plugins/UnderlinePlugin';
import UnorderedPlugin from './toolbar/plugins/UnorderedPlugin';

export type RichTextIntl = InternalRichTextIntl;

export interface RichTextProps {
  onChange: (state: EditorState) => void;
  error?: string;
  help?: string;
  onError?: (error: Error, editor: LexicalEditor) => void;
  editorState?: InitialEditorStateType;
  intl?: InternalRichTextIntl;
}

export function RichText(props: RichTextProps) {
  const { onChange, error, help, editorState, onError, intl } = props;

  return (
    <RichTextProvider>
      <LexicalComposer
        initialConfig={{
          namespace: 'RichText',
          theme: Theme,
          nodes: useNodes(intl || defaultIntl),
          onError: (error, editor) => {
            onError?.(error, editor);
          },
          editorState,
        }}
      >
        <div className="flex flex-1 flex-col gap-3">
          <ToolbarPlugin
            intl={intl}
            alignmentPlugins={[
              <LeftAlignmentPlugin key="left" />,
              <CenterAlignmentPlugin key="center" />,
              <RightAlignmentPlugin key="right" />,
              <JustifyAlignmentPlugin key="justify" />,
            ]}
            formatPlugins={[
              <BoldPlugin key="bold" />,
              <ItalicPlugin key="italic" />,
              <UnderlinePlugin key="underline" />,
              <SubscriptPlugin key="subscript" />,
              <SuperscriptPlugin key="superscript" />,
              <ColorPickerPlugin key="textColor" />,
            ]}
            actionPlugins={[
              <ParagraphPlugin key="paragraph" />,
              <Header1Plugin key="h1" />,
              <Header2Plugin key="h2" />,
              <Header3Plugin key="h3" />,
              <UnorderedPlugin key="ul" />,
              <OrderedPlugin key="ol" />,
            ]}
            insertPlugins={[
              <InternalTablePlugin key="table" />,
              <InternalImagePlugin key="image" />,
            ]}
          />
          <ImagesPlugin />
          <TablePlugin />
          <AutoFocusPlugin />
          <div>
            <RichTextPlugin
              contentEditable={
                <div className="relative">
                  <ContentEditable
                    spellCheck={false}
                    className={clsx(
                      'form-textarea block min-h-[200px] w-full rounded-md  shadow-sm sm:text-sm',
                      error
                        ? 'border-danger-300 focus:ring-danger-500'
                        : 'border-neutral-300 focus:ring-primary-500',
                    )}
                  />
                  <Help error={error} help={help} noMargin />
                </div>
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            <ListPlugin />
          </div>
        </div>
      </LexicalComposer>
    </RichTextProvider>
  );
}

type Props = {
  defaultSelection?: 'rootStart' | 'rootEnd';
};

function AutoFocusPlugin({ defaultSelection }: Props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus(
      () => {
        // If we try and move selection to the same point with setBaseAndExtent, it won't
        // trigger a re-focus on the element. So in the case this occurs, we'll need to correct it.
        // Normally this is fine, Selection API !== Focus API, but fore the intents of the naming
        // of this plugin, which should preserve focus too.
        const activeElement = document.activeElement;
        const rootElement = editor.getRootElement() as HTMLDivElement;
        if (
          rootElement !== null &&
          (activeElement === null || !rootElement.contains(activeElement))
        ) {
          // Note: preventScroll won't work in Webkit.
          rootElement.focus({ preventScroll: true });
        }
      },
      { defaultSelection },
    );
  }, [defaultSelection, editor]);

  return null;
}
