import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';
import {
  FieldValues,
  FormProvider,
  Resolver,
  ResolverResult,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import type { AnyObjectSchema } from 'yup';

import { EmptyValue, getEmptyValueProp } from '../util';

import { configContext } from './context/RHFContext';

function multiYupResolver<TValues extends FieldValues>(
  schemas: AnyObjectSchema | AnyObjectSchema[],
) {
  const superResolver: Resolver<TValues> = async (
    formValues,
    context,
    options,
  ) => {
    if (!Array.isArray(schemas)) {
      schemas = [schemas];
    }

    const allErrors = {};
    const allValues = {};
    for (let schema of schemas.slice().reverse()) {
      const resolver = yupResolver(schema);
      const { values, errors } = await resolver(formValues, context, options);
      Object.assign(allErrors, errors);
      Object.assign(allValues, values);
    }
    return {
      errors: allErrors,
      values: allValues,
    } as ResolverResult<TValues>;
  };
  return superResolver;
}

export interface BaseRootFormError {
  type?: string;
  message: string;
}

export type FormRHFProps<TValues extends FieldValues> = Omit<
  UseFormProps<TValues>,
  'resolver' | 'reValidateMode' | 'shouldUnregister'
> & {
  onSubmit: SubmitHandler<TValues>;
  onInvalidSubmit?: SubmitErrorHandler<TValues>;
  children: ReactNode;
  // TODO: Revert type to `AnyObjectSchema | AnyObjectSchema[]` when https://github.com/jquense/yup/issues/1849 is fixed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema?: any;
  noDefaultStyle?: boolean;
  id?: string;
  className?: string;
  emptyValue?: EmptyValue;
  formatSubmitError?: (error: any) => BaseRootFormError;
};

const graphqlPrefix = 'GraphQL error: ';

function defaultFormatSubmitError(error: any) {
  const message =
    typeof error.message === 'string' && error.message !== ''
      ? error.message.replace(graphqlPrefix, '')
      : 'Unknown error';
  return { type: 'server', message };
}

export interface RootFormError extends BaseRootFormError {
  error: any;
  data: any;
}

export function FormRHF<TValues extends FieldValues>(
  props: FormRHFProps<TValues>,
) {
  const {
    onSubmit,
    onInvalidSubmit,
    noDefaultStyle = false,
    id,
    className,
    validationSchema,
    children,
    emptyValue,
    formatSubmitError = defaultFormatSubmitError,
    ...formHookProps
  } = props;
  const methods = useForm<TValues>({
    ...formHookProps,
    shouldUseNativeValidation: false,
    resolver: validationSchema ? multiYupResolver(validationSchema) : undefined,
  });

  const finalEmptyValue = getEmptyValueProp(props);
  const configValue = useMemo(() => {
    return {
      emptyValue: finalEmptyValue,
    };
  }, [finalEmptyValue]);

  return (
    <configContext.Provider value={configValue}>
      <FormProvider {...methods}>
        <form
          id={id}
          className={clsx(
            { 'flex flex-1 flex-col gap-y-4': !noDefaultStyle },
            className,
          )}
          onSubmit={(event) => {
            // We have to call this before the handleSubmit from react-hook-form
            // because the library calls us after doing async activity and it is too late to stop the propagation.
            event.stopPropagation();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            methods.handleSubmit(async (data, event) => {
              try {
                await onSubmit(data, event);
              } catch (error) {
                if (!(error instanceof Error)) {
                  // eslint-disable-next-line no-console
                  console.error(
                    error,
                    'FormRHF submit resulted in a non-error exception',
                  );
                }

                const rootError: RootFormError = {
                  ...formatSubmitError(error as Error),
                  error,
                  data,
                };

                methods.setError('root', rootError);
              }
            }, onInvalidSubmit)(event);
          }}
          noValidate
        >
          {children}
        </form>
      </FormProvider>
    </configContext.Provider>
  );
}
