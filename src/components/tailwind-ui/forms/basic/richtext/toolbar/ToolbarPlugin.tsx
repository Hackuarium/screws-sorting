import { $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import * as Toolbar from '@radix-ui/react-toolbar';
import clsx from 'clsx';
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { forwardRef, ReactNode, useCallback, useEffect, useMemo } from 'react';

import { WithTooltip } from '../../../../elements/popper/WithTooltip';
import { useRichTextContext } from '../context/RichTextContext';
import { RichTextBlockType } from '../context/RichTextProvider';

import defaultIntl from './intl';
import { toolbarContext } from './toolbarContext';
import { ToolbarPluginContextState, ToolbarPluginProps } from './types';

export function ToolbarPlugin(props: ToolbarPluginProps) {
  const { intl = defaultIntl, ...otherProps } = props;

  const defaultState = useMemo<ToolbarPluginContextState>(() => {
    return {
      intl,
    };
  }, [intl]);

  return (
    <toolbarContext.Provider value={defaultState}>
      <div className="flex flex-row gap-5">
        <ToolbarPluginInternal {...otherProps} />
      </div>
    </toolbarContext.Provider>
  );
}

function ToolbarPluginInternal(props: Omit<ToolbarPluginProps, 'intl'>) {
  const {
    formatPlugins = [],
    actionPlugins = [],
    alignmentPlugins = [],
    insertPlugins = [],
  } = props;

  const lexicalContext = useLexicalComposerContext();
  const richTextContext = useRichTextContext();

  const updateToolbar = useCallback(() => {
    const [, dispatch] = richTextContext;

    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor.getNode();
      const element =
        anchor.getKey() === 'root'
          ? anchor
          : anchor.getTopLevelElementOrThrow();

      const blockType = (
        $isHeadingNode(element) || $isListNode(element)
          ? element.getTag()
          : element.getType()
      ) as RichTextBlockType;

      dispatch({
        type: 'CHANGE_MULTIPLE_TOOLBAR',
        payload: {
          bold: selection.hasFormat('bold'),
          italic: selection.hasFormat('italic'),
          underline: selection.hasFormat('underline'),
          superscript: selection.hasFormat('superscript'),
          subscript: selection.hasFormat('subscript'),
          blockAlignment: element.getFormatType() || 'left',
          textColor: $getSelectionStyleValueForProperty(
            selection,
            'color',
            'black',
          ),
          blockType,
        },
      });
    }
  }, [richTextContext]);

  useEffect(() => {
    const [editor] = lexicalContext;

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1,
      ),
    );
  }, [lexicalContext, updateToolbar]);

  return (
    <Toolbar.Root className="flex w-full min-w-max rounded-md bg-white p-[10px] shadow-[0_2px_10px] shadow-neutral-300">
      <Toolbar.ToggleGroup type="multiple">{formatPlugins}</Toolbar.ToggleGroup>
      <Toolbar.Separator className="mx-[10px] w-[1px] bg-neutral-300" />
      <Toolbar.ToggleGroup type="single">
        {alignmentPlugins}
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className="mx-[10px] w-[1px] bg-neutral-300" />
      <Toolbar.ToggleGroup type="single">{actionPlugins}</Toolbar.ToggleGroup>
      <Toolbar.Separator className="mx-[10px] w-[1px] bg-neutral-300" />
      <Toolbar.ToggleGroup type="single">{insertPlugins}</Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
}

interface ToolbarPluginButtonProps {
  children: ReactNode;
  onClick: () => void;
  tooltip: ReactNode;
  variant: 'secondary' | 'white';
}

export const ToolbarPluginButton = forwardRef<
  HTMLButtonElement,
  ToolbarPluginButtonProps
>((props, ref) => {
  const { children, onClick, tooltip, variant } = props;
  return (
    <div
      className={clsx(
        'ml-0.5 inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto items-center justify-center rounded bg-white px-[5px] text-[13px] leading-none text-neutral-900 outline-none first:ml-0 hover:bg-primary-100 hover:text-neutral-500 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-primary-300 data-[state=on]:bg-primary-500 data-[state=on]:text-primary-900',
        {
          'bg-white': variant === 'white',
          'bg-primary-200': variant === 'secondary',
        },
      )}
    >
      <WithTooltip tooltip={tooltip}>
        <Toolbar.Button
          ref={ref}
          onClick={onClick}
          value="right"
          aria-label="Right aligned"
        >
          {children}
        </Toolbar.Button>
      </WithTooltip>
    </div>
  );
});
