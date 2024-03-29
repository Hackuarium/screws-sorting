import clsx from 'clsx';
import {
  forwardRef,
  Ref,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

import { Help } from './common';
import { labelColor, labelDisabledColor } from './utils.common';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  help?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef(function CheckboxForwardRef(
  props: CheckboxProps,
  ref: Ref<HTMLInputElement | null>,
) {
  const {
    name,
    value,
    id = `${name}-${String(value)}`,
    label,
    help,
    className,
    error,
    indeterminate,
    ...otherProps
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current);
  useLayoutEffect(() => {
    if (inputRef.current && indeterminate !== undefined) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={clsx('flex items-start', className)}>
      <div className="flex h-5 items-center">
        <input
          {...otherProps}
          id={id}
          name={name}
          value={value}
          type="checkbox"
          ref={inputRef}
          className={clsx(
            'form-checkbox h-4 w-4 rounded text-primary-600 disabled:text-neutral-300',
            error
              ? 'border-danger-300 focus:ring-danger-500'
              : 'border-neutral-300 focus:ring-primary-500',
          )}
        />
      </div>

      <div className="ml-3 text-sm">
        {label && (
          <label
            htmlFor={id}
            className={clsx(
              'font-semibold',
              props.disabled ? labelDisabledColor : labelColor,
            )}
          >
            {label}
          </label>
        )}
        <Help error={error} help={help} noMargin />
      </div>
    </div>
  );
});
