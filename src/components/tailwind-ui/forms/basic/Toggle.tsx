import * as RadixSwitch from '@radix-ui/react-switch';
import clsx from 'clsx';

import { Help } from './common';
import { labelColor, labelDisabledColor } from './utils.common';

export interface ToggleProps {
  label: string;
  activated: boolean;
  onToggle: (activated: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: ToggleSize;
  name?: string;
  error?: string;
}

export const ToggleSize = {
  Small: 'Small',
  Large: 'Large',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ToggleSize = (typeof ToggleSize)[keyof typeof ToggleSize];

export function Toggle(props: ToggleProps) {
  const {
    error,
    size = 'Small',
    label,
    disabled,
    activated,
    onToggle,
    name,
    className,
  } = props;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-5">
        <RadixSwitch.Root
          checked={activated}
          disabled={disabled}
          onCheckedChange={onToggle}
          name={name}
          className={clsx(
            'relative flex items-center rounded-full outline-none disabled:bg-neutral-100',
            size === ToggleSize.Large ? 'h-6 w-11' : 'h-4 w-9',
            className,
            disabled ? 'cursor-default' : 'cursor-pointer',
            activated && !error ? 'bg-primary-600' : 'bg-neutral-200',
          )}
        >
          <RadixSwitch.Thumb
            className={clsx(
              'block h-5 w-5 rounded-full border border-neutral-200 shadow ring-0 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-5',
              error ? 'bg-danger-600' : 'bg-white',
            )}
          />
        </RadixSwitch.Root>
        <label
          className={clsx(
            'text-sm font-semibold',
            disabled ? labelDisabledColor : labelColor,
          )}
        >
          {label}
        </label>
      </div>
      {error && <Help error={error} />}
    </div>
  );
}
