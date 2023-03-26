import { EditorState } from 'lexical';
import { useController } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { RichText } from '../basic/richtext/RichText';
import { defaultErrorSerializer, ErrorSerializer } from '../util';

export interface RichTextFieldRHFProps {
  name: string;
  serializeError?: ErrorSerializer;
  deps?: string[];
}

export function RichTextFieldRHF(props: RichTextFieldRHFProps) {
  const { name, serializeError = defaultErrorSerializer, deps } = props;
  const { setValue, trigger } = useCheckedFormRHFContext();

  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({ name });

  function onChange(state: EditorState) {
    setValue(name, JSON.stringify(state), {
      shouldValidate: isSubmitted,
      shouldTouch: true,
    });

    if (deps && isSubmitted) {
      void trigger(deps);
    }
  }

  return (
    <RichText
      onChange={onChange}
      editorState={field.value || undefined}
      error={serializeError(error)}
    />
  );
}
