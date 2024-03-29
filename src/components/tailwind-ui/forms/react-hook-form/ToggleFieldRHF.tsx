import { useCallback } from 'react';
import { get, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { Toggle, ToggleProps } from '../basic/Toggle';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFRegisterProps,
  RHFValidationProps,
} from '../util';

export interface ToggleFieldProps
  extends Omit<ToggleProps, 'activated' | 'onToggle'> {
  name: string;
  label: string;
}

export type ToggleFieldRHFProps = ToggleFieldProps &
  FieldProps &
  RHFValidationProps &
  RHFRegisterProps;

export function ToggleFieldRHF(props: ToggleFieldRHFProps): JSX.Element {
  const {
    name,
    serializeError = defaultErrorSerializer,
    rhfOptions,
    deps,
    ...otherProps
  } = props;
  const {
    setValue,
    trigger,
    register,
    formState: { errors, isSubmitted },
  } = useCheckedFormRHFContext();
  const activated = useWatch({
    name,
  });

  const error = get(errors, name);

  const handleToggle = useCallback(
    (value: boolean) => {
      setValue(name, value, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, name, isSubmitted, deps, trigger],
  );

  return (
    <Toggle
      onToggle={handleToggle}
      {...register(name, rhfOptions)}
      activated={activated}
      error={serializeError(error)}
      {...otherProps}
    />
  );
}
