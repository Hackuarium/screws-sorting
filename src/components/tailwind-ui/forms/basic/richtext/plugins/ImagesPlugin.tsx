import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import {
  $createImageNode,
  ImageNode,
  ImagePayloadWithKey,
  NewImagePayload,
} from '../nodes/ImageNode';

export type InsertImagePayload = Readonly<ImagePayloadWithKey>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<NewImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const node = $createImageNode(payload);
          $insertNodes([node]);

          if ($isRootOrShadowRoot(node.getParentOrThrow())) {
            $wrapNodeInElement(node, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}
