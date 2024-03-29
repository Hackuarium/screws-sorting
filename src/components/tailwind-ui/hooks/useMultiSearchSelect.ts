import { useMemo, useState } from 'react';

import { SimpleSelectOption } from '../forms/basic/Select';
import { defaultOptionsFilter } from '../utils/defaultSearchSelectUtils';

import {
  SearchSelectHookConfig,
  SearchSelectHookResult,
  SimpleSearchSelectHookConfig,
} from './useSearchSelect';

export interface MultiSearchSelectHookResult<OptionType>
  extends Omit<SearchSelectHookResult<OptionType>, 'selected' | 'onSelect'> {
  selected: OptionType[];
  selectedFiltered: OptionType[];
  onSelect: (newOptions: OptionType[]) => void;
}

export interface SimpleMultiSearchSelectHookConfig<OptionType>
  extends Omit<SimpleSearchSelectHookConfig<OptionType>, 'initialSelected'> {
  initialSelected?: OptionType[];
}
export interface MultiSearchSelectHookConfig<OptionType>
  extends Omit<SearchSelectHookConfig<OptionType>, 'initialSelected'> {
  initialSelected?: OptionType[];
}

export function useMultiSearchSelect<OptionType>(
  config: OptionType extends SimpleSelectOption
    ? SimpleMultiSearchSelectHookConfig<OptionType>
    : MultiSearchSelectHookConfig<OptionType>,
): MultiSearchSelectHookResult<OptionType> {
  const {
    options,
    filterOptions = defaultOptionsFilter,
    initialSelected = [],
  } = config;
  const [searchValue, setSearchValue] = useState('');
  const filteredOptions = useMemo(
    () => filterOptions(searchValue, options),
    [options, filterOptions, searchValue],
  );
  const [selected, setSelected] = useState<OptionType[]>(initialSelected);
  const selectedFiltered = useMemo(() => {
    return filterOptions(searchValue, selected);
  }, [selected, filterOptions, searchValue]);

  return {
    searchValue,
    onSearchChange: setSearchValue,
    options: filteredOptions,
    selected,
    selectedFiltered,
    onSelect: setSelected,
  };
}
