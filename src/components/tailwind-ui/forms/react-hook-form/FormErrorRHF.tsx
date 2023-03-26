import clsx from 'clsx';

import { Alert, AlertType } from '../../feedback/Alert';

import { useRootFormError } from './hooks/useRootFormError';

export function FormErrorRHF(props: {
  className?: string;
}): JSX.Element | null {
  const root = useRootFormError();

  if (!root) {
    return null;
  }

  return (
    <Alert
      className={clsx(props.className, 'whitespace-pre-wrap')}
      title={root.message}
      type={AlertType.ERROR}
    />
  );
}
