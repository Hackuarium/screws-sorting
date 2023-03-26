import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import clsx from 'clsx';
import {
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  $getNodeByKey,
  NodeKey,
  LexicalNode,
} from 'lexical';
import { useCallback, useEffect, useRef } from 'react';

import { $isImageNode, ImagePayloadWithKey } from '../nodes/ImageNode';

export function ImageComponent(props: ImagePayloadWithKey) {
  const { alt, imageKey, src } = props;
  const ref = useRef<HTMLImageElement | null>(null);

  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(imageKey);

  const [editor] = useLexicalComposerContext();

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        const node = $getNodeByKeyOrThrow(imageKey);

        if ($isImageNode(node)) {
          node.remove();
        }

        setSelected(false);
      }
      return false;
    },
    [isSelected, setSelected, imageKey],
  );

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          if (event.target === ref.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );

    return () => {
      unregister();
    };
  }, [clearSelection, editor, isSelected, onDelete, setSelected]);

  return (
    <img
      src={src}
      alt={alt}
      ref={ref}
      className={clsx({
        'border border-primary-500': isSelected,
      })}
    />
  );
}

function $getNodeByKeyOrThrow(key: NodeKey): LexicalNode {
  const node = $getNodeByKey(key);

  if (!node) {
    throw new Error('node key not found');
  }

  return node;
}
