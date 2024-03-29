import clsx from 'clsx';
import { ComponentType, ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FormRHF, FormRHFProps } from '../forms/react-hook-form/FormRHF';

import { Modal, ModalProps } from './Modal';

export type FormRHFModalProps<TValues extends FieldValues> = Omit<
  ModalProps<ComponentType<FormRHFProps<TValues>>>,
  'wrapperProps' | 'wrapperComponent'
> &
  Omit<FormRHFProps<TValues>, 'className' | 'children'>;

export function FormRHFModal<TValues extends FieldValues>(
  props: FormRHFModalProps<TValues>,
) {
  const {
    children,
    requestCloseOnBackdrop = false,
    requestCloseOnEsc = false,
    ...otherProps
  } = props;
  return (
    <Modal<ComponentType<FormRHFProps<TValues>>>
      {...otherProps}
      requestCloseOnBackdrop={requestCloseOnBackdrop}
      requestCloseOnEsc={requestCloseOnEsc}
      wrapperComponent={FormRHF}
      wrapperProps={otherProps}
    >
      {children}
    </Modal>
  );
}

FormRHFModal.Header = Modal.Header;

FormRHFModal.Body = function FormRHFModalBody(props: {
  children: ReactNode;
  className?: string;
  noDefaultStyle?: boolean;
}) {
  const { noDefaultStyle = false, className, children } = props;
  return (
    <Modal.Body className={clsx({ 'space-y-4': !noDefaultStyle }, className)}>
      {children}
    </Modal.Body>
  );
};

FormRHFModal.Description = Modal.Description;

FormRHFModal.Footer = Modal.Footer;
