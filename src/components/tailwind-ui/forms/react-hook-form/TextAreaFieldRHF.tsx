import { get } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { TextArea, TextAreaProps } from '../basic/TextArea';
import {
  defaultErrorSerializer,
  FieldProps,
  getEmptyValueProp,
  getSetValueAs,
  RHFRegisterProps,
  RHFValidationProps,
} from '../util';

import { InputFieldRHFCustomProps } from './InputFieldRHF';
import { useRHFConfig } from './context/RHFContext';

export type TextAreaFieldProps = TextAreaProps;

export type TextAreaFieldRHFProps = TextAreaFieldProps &
  FieldProps &
  RHFValidationProps &
  InputFieldRHFCustomProps;

export function TextAreaFieldRHF(
  props: TextAreaFieldRHFProps & RHFRegisterProps,
): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useCheckedFormRHFContext();
  const error = get(errors, props.name);
  const {
    emptyValue,
    onChange,
    onBlur,
    deps,
    rhfOptions,
    serializeError = defaultErrorSerializer,
    ...otherProps
  } = props;
  const rhfConfig = useRHFConfig();
  const finalEmptyValue = getEmptyValueProp(props, rhfConfig);
  return (
    <TextArea
      {...otherProps}
      {...register(props.name, {
        onChange,
        onBlur,
        setValueAs: getSetValueAs(finalEmptyValue, 'text'),
        deps,
        ...rhfOptions,
      })}
      error={serializeError(error)}
    />
  );
}
