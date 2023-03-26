import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { labelColor, labelDisabledColor } from './utils.common';

export interface LabelProps {
  id?: string;
  text: string;
  hidden?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function Label(props: LabelProps) {
  return (
    <label
      htmlFor={props.id}
      className={clsx(
        'block text-sm font-semibold',
        props.disabled ? labelDisabledColor : labelColor,
        props.hidden && 'sr-only',
      )}
    >
      {props.text}
      {props.required && <span className="text-warning-600"> *</span>}
    </label>
  );
}

const helpColorMap = {
  error: 'text-danger-600',
  valid: 'text-success-700',
  help: 'text-neutral-500',
};

export function Help(props: {
  error?: string;
  valid?: string | boolean;
  help?: string;
  noMargin?: boolean;
}) {
  const { error, valid, help, noMargin } = props;
  if (!error && !(typeof valid === 'string') && !help) {
    return null;
  }

  let toDisplay = error
    ? ({ type: 'error', value: error } as const)
    : typeof valid === 'string'
    ? ({ type: 'valid', value: valid } as const)
    : ({ type: 'help', value: help } as const);

  return (
    <p
      className={clsx(
        'whitespace-pre-line text-sm',
        helpColorMap[toDisplay.type],
        !noMargin && 'mt-2',
      )}
    >
      {toDisplay.value}
    </p>
  );
}

export function InputCorner(props: { children: ReactNode }) {
  return <div className="text-sm">{props.children}</div>;
}

export function InputErrorIcon() {
  return <ExclamationCircleIcon className="ml-2 h-5 w-5 text-danger-500" />;
}

export function InputValidIcon() {
  return <CheckIcon className="ml-2 h-5 w-5 text-success-600" />;
}
