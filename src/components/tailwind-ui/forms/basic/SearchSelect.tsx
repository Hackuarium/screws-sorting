// @ts-nocheck

import { ReactNode, Ref, useMemo } from 'react';

import { forwardRefWithGeneric } from '../../util';
import {
  defaultCanCreate,
  defaultGetValue,
  defaultRenderCreate,
  defaultRenderOption,
} from '../../utils/defaultSearchSelectUtils';
import { useSearchSelectInternals } from '../../utils/hooks/useSearchSelectInternals';
import { InternalSearchSelect } from '../../utils/search-select-utils';

import { GetValue, RenderOption, SimpleSelectOption } from './Select';

export interface SimpleSearchSelectProps<OptionType> {
  /**
   * List of options to select from.
   */
  options: OptionType[];
  /**
   * Currently selected option.
   */
  selected?: OptionType;
  /**
   * Callback which will be called when an option is selected or when clearing is requested.
   */
  onSelect: (option: OptionType | undefined) => void;
  /**
   * Callback which will be called when the user selects the "create" option.
   * Passing this prop is what makes the option to appear.
   */
  onCreate?: SearchSelectOnCreateCallback<OptionType>;
  /**
   * Callback which will be called before displaying the "create" option to the
   * user. If it is present and doesn't return `true`, the option will not be displayed.
   */
  canCreate?: SearchSelectCanCreateCallback;
  /**
   * Custom function to render the "create" option.
   */
  renderCreate?: SearchSelectRenderCreateCallback;

  /**
   * Function to get the value that uniquely identifies each option.
   */
  getValue?: GetValue<OptionType>;
  /**
   * Custom function to render each option.
   */
  renderOption?: RenderOption<OptionType>;
  /**
   * Custom function to render the selected option.
   */
  renderSelectedOption?: RenderOption<OptionType>;

  /**
   * Whether the list should be closed when an element is selected.
   */
  closeListOnSelect?: boolean;
  /**
   * Whether the search value should be cleared (by calling `onSearchChange`
   * with an empty string) when an element is selected.
   */
  clearSearchOnSelect?: boolean;

  /**
   * Value to control the input field.
   */
  searchValue: string;
  /**
   * Called when the value in the input is about to change.
   */
  onSearchChange: (newValue: string) => void;
  /**
   * Input field's label.
   */
  label: string;
  /**
   * Do not display the label, keeping it in the DOM for accessibility.
   */
  hiddenLabel?: boolean;
  /**
   * Custom react node to display in the upper right corner of the input
   */
  corner?: ReactNode;
  /**
   * Placeholder to display when no value is selected and no search text is entered.
   */
  placeholder?: string;
  /**
   * Adds a red * to the label.
   */
  required?: boolean;
  /**
   * Called when the input field is blurred.
   */
  onBlur?: (e: React.FocusEvent) => void;
  /**
   * Input field's id.
   */
  id?: string;
  /**
   * Input field's name.
   */
  name?: string;
  /**
   * Allows to unselect the currently selected value.
   */
  clearable?: boolean;
  /**
   * Disable interactions with the field.
   */
  disabled?: boolean;
  /**
   * Displays a spinner in the field.
   */
  loading?: boolean;
  /**
   * Error message.
   */
  error?: string;
  /**
   * Explanation or precisions about what the field is for.
   */
  help?: string;
  /**
   * Class applied to the highlighted option.
   */
  highlightClassName?: string;
  /**
   * Size for input.
   */
  size?: number;
  /**
   * Focus input on mount.
   */
  autoFocus?: boolean;
  /**
   * Input Classnames
   */
  inputClassName?: string;
}

export type SearchSelectCanCreateCallback = (value: string) => boolean;
export type SearchSelectOnCreateCallback<OptionType> = (
  value: string,
  select: (option: OptionType | undefined) => void,
) => void;
export type SearchSelectRenderCreateCallback = (value: string) => ReactNode;

export interface SearchSelectProps<OptionType>
  extends SimpleSearchSelectProps<OptionType> {
  getValue: GetValue<OptionType>;
  renderOption: RenderOption<OptionType>;
}

export const SearchSelect = forwardRefWithGeneric(SearchSelectForwardRef);

function SearchSelectForwardRef<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleSearchSelectProps<OptionType>
    : SearchSelectProps<OptionType>,
  ref: Ref<HTMLInputElement>,
): JSX.Element {
  const {
    onSearchChange,
    options,
    onSelect,
    selected,
    getValue = defaultGetValue,
    renderOption = defaultRenderOption,
    renderSelectedOption,

    closeListOnSelect = true,
    clearSearchOnSelect = true,
    onCreate,
    canCreate = defaultCanCreate,
    renderCreate = defaultRenderCreate,
    ...otherProps
  } = props;

  const finalRenderSelectedOption = renderSelectedOption || renderOption;

  const formattedSelected = useMemo(() => {
    if (selected) {
      return {
        value: getValue(selected),
        label: finalRenderSelectedOption(selected),
      };
    }
  }, [selected, getValue, finalRenderSelectedOption]);

  const internalProps = useSearchSelectInternals({
    showSelected: false,
    searchValue: props.searchValue,
    onSearchChange,
    options,
    onSelect,
    getValue,
    renderOption,
    closeListOnSelect,
    clearSearchOnSelect,
    onCreate,
    canCreate,
    renderCreate,
    formattedSelected,
    selected: selected ? [selected] : [],
    pinSelectedOptions: false,
  });

  return (
    <InternalSearchSelect
      {...internalProps}
      {...otherProps}
      inputRef={ref}
      formattedSelected={formattedSelected}
      hasClearableValue={formattedSelected !== undefined}
    />
  );
}
