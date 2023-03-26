import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { ReactNode } from 'react';

import { ImageComponent } from '../components/ImageComponent';

export type ImagePayloadWithKey = ImagePayload & { imageKey: NodeKey };
export type NewImagePayload = ImagePayload & { imageKey?: NodeKey };

export interface ImagePayload {
  alt: string;
  src: string;
  key?: NodeKey;
}

export type SerializedImageNode = Spread<
  {
    alt: string;
    src: string;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactNode> {
  private src: string;
  private alt: string;

  public constructor(src: string, alt: string, imageKey?: NodeKey) {
    super(imageKey);

    this.src = src;
    this.alt = alt;
  }

  public static getType(): string {
    return 'image';
  }

  public static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.src, node.alt, node.__key);
  }

  public exportJSON(): SerializedImageNode {
    return {
      alt: this.alt,
      src: this.src,
      type: 'image',
      version: 1,
    };
  }

  public exportDOM(): DOMExportOutput {
    const element = document.createElement('img');

    element.setAttribute('src', this.src);
    element.setAttribute('alt', this.alt);

    return { element };
  }

  public static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { alt, src } = serializedNode;
    return $createImageNode({ alt, src });
  }

  public createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const className = config.theme.image;

    if (className) {
      div.className = className;
    }

    return div;
  }

  public updateDOM(): boolean {
    return false;
  }

  public decorate(): ReactNode {
    return (
      <ImageComponent alt={this.alt} src={this.src} imageKey={this.__key} />
    );
  }
}

export function $createImageNode(
  props: ImagePayload & { imageKey?: NodeKey },
): ImageNode {
  const { alt, src, imageKey } = props;
  return $applyNodeReplacement(new ImageNode(src, alt, imageKey));
}

export function $isImageNode(node?: LexicalNode | null): node is ImageNode {
  return node instanceof ImageNode;
}
