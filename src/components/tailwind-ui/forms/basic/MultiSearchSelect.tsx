// @ts-nocheck

import { MouseEvent, Ref, useCallback, useMemo } from 'react';

import { Badge, BadgeVariant } from '../../elements/badge/Badge';
import { Color } from '../../types';
import { forwardRefWithGeneric } from '../../util';
import {
  defaultCanCreate,
  defaultGetBadgeColor,
  defaultGetValue,
  defaultIsOptionRemovable,
  defaultRenderCreate,
  defaultRenderOption,
} from '../../utils/defaultSearchSelectUtils';
import { useSearchSelectInternals } from '../../utils/hooks/useSearchSelectInternals';
import {
  InternalMultiSearchSelect,
  IsOptionRemovableCallback,
} from '../../utils/search-select-utils';

import { SearchSelectProps, SimpleSearchSelectProps } from './SearchSelect';
import { SimpleSelectOption } from './Select';

export interface SimpleMultiSearchSelectProps<OptionType>
  extends Omit<SimpleSearchSelectProps<OptionType>, 'selected' | 'onSelect'> {
  selected: OptionType[];
  onSelect: (newSelected: OptionType[]) => void;
  getBadgeColor?: (option: OptionType) => Color;
  isOptionRemovable?: IsOptionRemovableCallback<OptionType>;
}

export interface MultiSearchSelectProps<OptionType>
  extends Omit<SearchSelectProps<OptionType>, 'selected' | 'onSelect'> {
  name: string;
  selected: OptionType[];
  onSelect: (newSelected: OptionType[]) => void;
  getBadgeColor?: (option: OptionType) => Color;
  isOptionRemovable?: IsOptionRemovableCallback<OptionType>;
}

export const MultiSearchSelect = forwardRefWithGeneric(
  MultiSearchSelectForwardRef,
);

function MultiSearchSelectForwardRef<OptionType>(
  props: OptionType extends SimpleSelectOption
    ? SimpleMultiSearchSelectProps<OptionType>
    : MultiSearchSelectProps<OptionType>,
  ref: Ref<HTMLInputElement>,
): JSX.Element {
  const {
    onSearchChange,
    options,
    onSelect,
    getBadgeColor = defaultGetBadgeColor,
    isOptionRemovable = defaultIsOptionRemovable,
    selected,
    getValue = defaultGetValue,
    renderOption = defaultRenderOption,
    renderSelectedOption,
    closeListOnSelect = false,
    clearSearchOnSelect = true,
    onCreate,
    canCreate = defaultCanCreate,
    renderCreate = defaultRenderCreate,
    clearable = true,
    disabled = false,
    ...otherProps
  } = props;

  const finalRenderSelectedOption = renderSelectedOption || renderOption;

  const nonRemovableValues = useMemo(
    () => selected.filter((value) => !isOptionRemovable(value)),
    [selected, isOptionRemovable],
  );

  const renderedSelected = useMemo(() => {
    return selected.map((option) => {
      const value = getValue(option);
      const rendered = finalRenderSelectedOption(option);

      function handleDismiss(event: MouseEvent) {
        event.preventDefault();
        onSelect(selected.filter((option) => getValue(option) !== value));
      }

      return (
        <Badge
          key={value}
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={rendered}
          color={getBadgeColor(option)}
          rounded
          onDismiss={
            disabled || !isOptionRemovable(option) ? undefined : handleDismiss
          }
        />
      );
    });
  }, [
    selected,
    getValue,
    finalRenderSelectedOption,
    onSelect,
    getBadgeColor,
    disabled,
    isOptionRemovable,
  ]);

  const handleSelect = useCallback(
    (value: OptionType | undefined) => {
      if (value === undefined) {
        onSelect(nonRemovableValues);
      } else {
        onSelect([...selected, value]);
      }
    },
    [selected, onSelect, nonRemovableValues],
  );

  const handleBackspace = useCallback(() => {
    if (
      selected.length > 0 &&
      isOptionRemovable(selected[selected.length - 1])
    ) {
      onSelect(selected.slice(0, -1));
    }
  }, [isOptionRemovable, onSelect, selected]);

  const internalProps = useSearchSelectInternals({
    showSelected: false,
    searchValue: props.searchValue,
    onSearchChange,
    options,
    onSelect: handleSelect,
    getValue,
    renderOption,
    closeListOnSelect,
    clearSearchOnSelect,
    onCreate,
    canCreate,
    renderCreate,
    isOptionRemovable,
    onBackspace: handleBackspace,
    selected,
    pinSelectedOptions: false,
  });

  return (
    <InternalMultiSearchSelect
      {...internalProps}
      {...otherProps}
      inputRef={ref}
      clearable={clearable}
      disabled={disabled}
      hasClearableValue={selected.length !== nonRemovableValues.length}
      selectedBadges={renderedSelected}
    />
  );
}
