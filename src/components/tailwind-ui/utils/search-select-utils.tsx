import {
  ChevronDownIcon,
  PlusCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
  useLayoutEffect,
  useRef,
} from 'react';

import { Spinner } from '../elements/spinner/Spinner';
import { Checkbox } from '../forms/basic/Checkbox';
import { Input } from '../forms/basic/Input';
import {
  Help,
  Label,
  InputErrorIcon,
  InputCorner,
} from '../forms/basic/common';
import { inputColor, inputError } from '../forms/basic/utils.common';
import { UseModifiedPopperReturn } from '../hooks/popper';

import {
  defaultNoResultsHint,
  preventDefault,
} from './defaultSearchSelectUtils';

export type OptionsFilter<OptionType> = (
  query: string,
  options: OptionType[],
) => OptionType[];

export type IsOptionRemovableCallback<OptionType> = (
  option: OptionType,
) => boolean;

export type InternalOption<OptionType> =
  | {
      type: 'option';
      value: string | number;
      label: ReactNode;
      originalValue: OptionType;
      selected: boolean;
      removable: boolean;
    }
  | {
      type: 'create';
      value: '___internal_create___';
      label: ReactNode;
      originalValue: string;
      selected: false;
      removable: false;
    };

export interface FormattedOptionProps<OptionType> {
  index: number;
  option: InternalOption<OptionType>;
  focused: number;
  setFocused: (index: number) => void;
  onSelect: (option: InternalOption<OptionType>) => void;
  highlightClassName: string;
  showSelected: boolean;
}

export function FormattedOption<OptionType>(
  props: FormattedOptionProps<OptionType>,
) {
  const {
    index,
    option,
    focused,
    setFocused,
    onSelect,
    showSelected,
    highlightClassName,
  } = props;
  const isFocused = focused === index;
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isFocused) {
      ref.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [isFocused]);

  return (
    <div
      ref={ref}
      className={clsx(
        isFocused ? highlightClassName : 'text-neutral-900',
        'py-2 px-4',
      )}
      onMouseMove={() => setFocused(index)}
      onClick={() => onSelect(option)}
    >
      {showSelected ? (
        <div className="flex items-center">
          {option.type === 'create' ? (
            <PlusCircleIcon className="-ml-0.5 mr-3 h-5 w-5 text-primary-600" />
          ) : (
            <Checkbox
              readOnly
              checked={option.selected}
              disabled={!option.removable}
              name={String(option.value)}
            />
          )}

          <div
            className={clsx({
              'text-neutral-500': !option.removable && option.selected,
            })}
          >
            {option.label}
          </div>
        </div>
      ) : option.selected ? null : (
        option.label
      )}
    </div>
  );
}

interface UseSearchSelectInternalsReturn<OptionType>
  extends UseModifiedPopperReturn<HTMLElement> {
  mainRef: Ref<HTMLDivElement>;
  closeList: () => void;
  openList: () => void;
  isListOpen: boolean;
  formattedOptions: InternalOption<OptionType>[];
  focused: number;
  showSelected: boolean;
  setFocused: (newFocus: number) => void;
  onSelect: (option: InternalOption<OptionType>) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleChevronDownClick: (event: MouseEvent) => void;
  handleXClick: (event: MouseEvent) => void;
}

interface InternalSearchSelectProps<OptionType>
  extends UseSearchSelectInternalsReturn<OptionType> {
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  noResultsHint?: ReactNode;
  error?: string;
  help?: string;
  label: string;
  hiddenLabel?: boolean;
  corner?: ReactNode;
  placeholder?: string;
  searchValue: string;
  formattedSelected?: { value: string | number; label: ReactNode };
  showSelected: boolean;
  hasClearableValue: boolean;
  highlightClassName?: string;
  required?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onBlur?: (e: React.FocusEvent) => void;
  name?: string;
  id?: string;
  size?: number;
  inputClassName?: string;
}

export function InternalSearchSelect<OptionType>(
  props: InternalSearchSelectProps<OptionType>,
): JSX.Element {
  const {
    mainRef,
    inputRef,
    closeList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    onSelect,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,

    clearable = false,
    disabled = false,
    required = false,
    loading = false,
    autoFocus = false,
    noResultsHint = defaultNoResultsHint,
    error,
    help,
    label,
    hiddenLabel,
    corner,
    placeholder,
    searchValue,
    formattedSelected,
    hasClearableValue,
    name,
    onBlur,
    highlightClassName = '',
    showSelected = false,
    size,
    inputClassName,
  } = props;

  const finalHighlightClassName =
    highlightClassName ||
    (showSelected ? 'bg-neutral-200' : 'text-white bg-primary-600');
  return (
    <div ref={mainRef}>
      <Input
        inputClassName={inputClassName}
        autoFocus={autoFocus}
        ref={inputRef}
        required={required}
        wrapperRef={setReferenceElement}
        type="text"
        name={name || label}
        label={label}
        hiddenLabel={hiddenLabel}
        corner={corner}
        value={searchValue}
        disabled={disabled}
        size={size}
        error={error}
        help={help}
        autoComplete="off"
        onBlur={(event) => {
          onBlur?.(event);
          closeList();
        }}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={openList}
        placeholder={placeholder}
        inlinePlaceholder={
          formattedSelected && !searchValue
            ? formattedSelected.label
            : undefined
        }
        trailingInlineAddon={
          <TrailingTools
            {...{
              loading,
              clearable,
              hasClearableValue,
              disabled,
              handleXClick,
              handleChevronDownClick,
            }}
          />
        }
      />

      {isListOpen && (
        <OptionsList
          {...{
            setPopperElement,
            popperProps,
            formattedOptions,
            noResultsHint,
            focused,
            setFocused,
            onSelect,
            highlightClassName: finalHighlightClassName,
            showSelected,
          }}
        />
      )}
    </div>
  );
}

interface InternalMultiSearchSelectProps<OptionType>
  extends InternalSearchSelectProps<OptionType> {
  selectedBadges?: ReactNode[];
  showSelected: boolean;
}
export function InternalMultiSearchSelect<OptionType>(
  props: InternalMultiSearchSelectProps<OptionType>,
): JSX.Element {
  const {
    mainRef,
    inputRef,
    closeList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    onSelect,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,

    clearable = false,
    disabled = false,
    required = false,
    loading = false,
    autoFocus = false,
    noResultsHint,
    error,
    help,
    label,
    hiddenLabel,
    corner,
    placeholder,
    searchValue,
    selectedBadges,
    hasClearableValue,
    name,
    id = name,
    onBlur,
    highlightClassName,
    showSelected = false,
  } = props;

  const finalHighlightClassName =
    highlightClassName ||
    (showSelected ? 'bg-neutral-200' : 'text-white bg-primary-600');
  return (
    <div ref={mainRef} className="flex flex-col">
      <div className="flex items-baseline justify-between gap-2">
        <Label
          id={id}
          text={label}
          hidden={hiddenLabel}
          required={required}
          disabled={disabled}
        />
        <InputCorner>{corner}</InputCorner>
      </div>
      <label
        ref={setReferenceElement}
        htmlFor={id}
        className={clsx(
          'border py-2 px-3 focus-within:ring-1',
          'relative flex flex-1 flex-row text-base shadow-sm sm:text-sm',
          'rounded-md',
          {
            'mt-1': !hiddenLabel || corner,
            [inputColor]: !error,
            [inputError]: error,
            'bg-neutral-50 text-neutral-500': disabled,
            'bg-white': !disabled,
          },
        )}
      >
        <div className="flex flex-1 flex-row flex-wrap gap-1.5">
          {selectedBadges}
          <input
            id={id}
            ref={inputRef}
            type="text"
            name={name || label}
            value={searchValue}
            size={Math.max(5, placeholder?.length || 0, searchValue.length)}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete="off"
            onBlur={(event) => {
              onBlur?.(event);
              closeList();
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={openList}
            placeholder={placeholder}
            className={clsx(
              {
                'flex-1 border-none p-0 focus:outline-none focus:ring-0 sm:text-sm':
                  true,
                'bg-neutral-50 text-neutral-500': disabled,
              },
              error ? 'placeholder-danger-300' : 'placeholder-neutral-400',
            )}
          />
        </div>
        <TrailingTools
          {...{
            loading,
            clearable,
            hasClearableValue,
            hasError: Boolean(error),
            disabled,
            handleXClick,
            handleChevronDownClick,
          }}
        />
      </label>
      <Help error={error} help={help} />
      {isListOpen && (
        <OptionsList
          {...{
            setPopperElement,
            popperProps,
            formattedOptions,
            noResultsHint,
            focused,
            setFocused,
            onSelect,
            highlightClassName: finalHighlightClassName,
            showSelected,
          }}
        />
      )}
    </div>
  );
}

type OptionsListProps<OptionType> = Pick<
  UseSearchSelectInternalsReturn<OptionType>,
  | 'setPopperElement'
  | 'popperProps'
  | 'formattedOptions'
  | 'focused'
  | 'setFocused'
  | 'onSelect'
> &
  Pick<
    InternalSearchSelectProps<OptionType>,
    'noResultsHint' | 'highlightClassName'
  > & {
    showSelected: boolean;
  };

function OptionsList<OptionType>(props: OptionsListProps<OptionType>) {
  const {
    setPopperElement,
    popperProps,
    formattedOptions,
    noResultsHint = defaultNoResultsHint,
    focused,
    setFocused,
    onSelect,
    highlightClassName = 'text-white bg-primary-600',
    showSelected,
  } = props;
  const finalFormattedOptions = showSelected
    ? formattedOptions
    : formattedOptions.filter((option) => !option.selected);
  return (
    <div
      ref={setPopperElement}
      {...popperProps}
      className="z-20 max-h-60 w-full cursor-default overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm"
      // Prevent click in the options list from blurring the input,
      // because that would close the list.
      onMouseDown={preventDefault}
    >
      {finalFormattedOptions.length === 0 ? (
        <div className="p-2">{noResultsHint}</div>
      ) : (
        finalFormattedOptions.map((option, index) => (
          <FormattedOption
            key={option.value}
            index={index}
            option={option}
            focused={focused}
            setFocused={setFocused}
            onSelect={onSelect}
            highlightClassName={highlightClassName}
            showSelected={showSelected}
          />
        ))
      )}
    </div>
  );
}

interface TrailingToolsProps {
  loading?: boolean;
  clearable?: boolean;
  hasClearableValue: boolean;
  hasError?: boolean;
  disabled?: boolean;
  handleXClick: (event: MouseEvent) => void;
  handleChevronDownClick: (event: MouseEvent) => void;
}

function TrailingTools(props: TrailingToolsProps) {
  const {
    loading,
    clearable,
    hasClearableValue,
    hasError,
    disabled,
    handleXClick,
    handleChevronDownClick,
  } = props;
  return (
    <div className="inline-flex cursor-default flex-row items-center text-neutral-400">
      {loading && <Spinner className="mr-1 h-5 w-5 text-neutral-400" />}
      {clearable && hasClearableValue && !disabled && (
        <XMarkIcon
          className="h-4 w-4 hover:text-neutral-500"
          onClick={handleXClick}
        />
      )}
      {/* font-mono so the vertical bar is vertically aligned with the SVG */}
      <span className="mx-1 font-mono font-light">{` | `}</span>
      <ChevronDownIcon
        className={clsx({
          'h-5 w-5': true,
          'hover:text-neutral-500': !disabled,
        })}
        onMouseDown={preventDefault}
        onClick={disabled ? undefined : handleChevronDownClick}
      />
      {hasError && <InputErrorIcon />}
    </div>
  );
}
