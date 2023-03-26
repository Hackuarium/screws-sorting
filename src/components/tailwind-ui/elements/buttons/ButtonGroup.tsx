import clsx from 'clsx';
import {
  Children,
  createContext,
  ElementType,
  ReactNode,
  useContext,
} from 'react';

import { Roundness, Size, Variant, Color } from '../..';
import { Dropdown, DropdownProps } from '../dropdown/Dropdown';

import { Button, ButtonProps } from './Button';
import { getButtonClassName } from './utils';

interface ButtonGroupContext {
  variant: Variant;
  color: Color;
  group: 'left' | 'right' | 'middle';
  size: Size;
  roundness: 'full' | 'light';
  disabled: boolean;
}

const context = createContext<ButtonGroupContext | null>(null);

export interface ButtonGroupProps {
  variant?: Variant;
  color?: Color;
  children: ReactNode;
  size?: Size;
  roundness?: 'full' | 'light';
  disabled?: boolean;
}

export function ButtonGroup(props: ButtonGroupProps): JSX.Element {
  const {
    children,
    variant = Variant.white,
    color = Color.primary,
    size = Size.medium,
    roundness = Roundness.light,
    disabled = false,
  } = props;

  const definedChildren = Children.toArray(children).filter(
    (child) => child != null,
  );
  const childrenCount = Children.count(definedChildren);
  const elements = Children.map(definedChildren, (child, index) => {
    const group =
      index === 0 ? 'left' : index === childrenCount - 1 ? 'right' : 'middle';

    return (
      <context.Provider
        // TODO: Refactor to avoid recreating context on each render.
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{ color, variant, group, size, roundness, disabled }}
      >
        {child}
      </context.Provider>
    );
  });

  return (
    <span
      className={clsx(
        'inline-flex shadow-sm',
        roundness === Roundness.full ? 'rounded-full' : 'rounded-md',
      )}
    >
      {elements}
    </span>
  );
}

ButtonGroup.Button = function ButtonGroupButton<
  T extends ElementType = 'button',
>(props: Omit<ButtonProps<T>, 'group'>) {
  const ctx = useContext(context);

  if (ctx === null) {
    throw new Error('context for ButtonGroup was not provided');
  }

  const {
    variant = ctx.variant,
    color = ctx.color,
    size = ctx.size,
    roundness = ctx.roundness,
    disabled = ctx.disabled,
  } = props;

  return (
    // @ts-expect-error the error is not very helpful here, maybe a TS bug
    <Button
      {...props}
      group={ctx.group}
      variant={variant}
      color={color}
      size={size}
      roundness={roundness}
      disabled={disabled}
    />
  );
};

ButtonGroup.Dropdown = function ButtonGroupDropdown<T>(
  props: Omit<DropdownProps<T>, 'buttonClassName' | 'noDefaultButtonStyle'> &
    Pick<ButtonProps, 'variant' | 'color'>,
) {
  const ctx = useContext(context);

  if (ctx === null) {
    throw new Error('context for ButtonGroup was not provided');
  }

  const options = {
    ...ctx,
    ...props,
  };
  const className = getButtonClassName({
    ...options,
    noBorder: false,
  });

  return (
    <Dropdown
      {...props}
      buttonClassName={className}
      noDefaultButtonStyle
      {...ctx}
    />
  );
};
