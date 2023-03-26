import * as RadixTooltip from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import {
  createContext,
  CSSProperties,
  forwardRef,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
} from 'react';

import { Portal } from '../../overlays/Portal';

export interface TooltipProps {
  children: [ReactElement<any>, ReactElement<any>];
  delay?: number;
  placement?: RadixTooltip.TooltipContentImplProps['side'];

  // False => Black background with white text
  // True => Gray background with black text
  invertColor?: boolean;
}

type TooltipContext = Required<Pick<TooltipProps, 'invertColor' | 'placement'>>;

const context = createContext<TooltipContext | null>(null);

function useTooltipContext() {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error('TooltipContext not found');
  }

  return ctx;
}

export function Tooltip(props: TooltipProps) {
  const {
    children,
    invertColor = false,
    delay = 400,
    placement = 'top',
  } = props;

  const content = children.find((e) => e.type === Tooltip.Content);
  const target = children.find((e) => e.type === Tooltip.Target);

  const contextValue = useMemo<TooltipContext>(() => {
    return { invertColor, placement };
  }, [invertColor, placement]);

  return (
    <context.Provider value={contextValue}>
      <RadixTooltip.Provider delayDuration={delay}>
        <RadixTooltip.Root>
          <RadixTooltip.Trigger asChild>{target}</RadixTooltip.Trigger>
          {content}
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </context.Provider>
  );
}

interface TooltipContentProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

Tooltip.Content = function TooltipContent(props: TooltipContentProps) {
  const { children, className, style } = props;
  const { invertColor, placement } = useTooltipContext();

  if (!children) {
    return null;
  }

  return (
    <Portal>
      <RadixTooltip.Content
        sideOffset={2}
        side={placement}
        className={clsx(
          className === '' || !className
            ? 'rounded-md py-1 px-2 text-xs'
            : `rounded-md py-1 px-2 ${className}`,
          invertColor
            ? 'bg-neutral-100 text-black'
            : 'bg-neutral-900 text-white',
        )}
        style={style}
      >
        <RadixTooltip.Arrow
          className={clsx(invertColor ? 'fill-neutral-100' : 'fill-black')}
        />
        {children}
      </RadixTooltip.Content>
    </Portal>
  );
};

interface TooltipTargetProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  noFit?: boolean;
}

Tooltip.Target = forwardRef<HTMLDivElement, TooltipTargetProps>(
  (props, ref) => {
    const { children, style, noFit, className, ...radixProps } = props;

    return (
      <div
        ref={ref}
        className={clsx({ 'max-w-fit': !noFit }, className)}
        style={style}
        {...radixProps}
      >
        {children}
      </div>
    );
  },
);
