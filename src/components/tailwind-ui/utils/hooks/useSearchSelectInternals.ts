import {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
} from 'react';

import {
  SearchSelectCanCreateCallback,
  SearchSelectOnCreateCallback,
  SearchSelectRenderCreateCallback,
} from '../../forms/basic/SearchSelect';
import { GetValue, RenderOption } from '../../forms/basic/Select';
import { useModifiedPopper, UseModifiedPopperReturn } from '../../hooks/popper';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useOnOff } from '../../hooks/useOnOff';
import {
  InternalOption,
  IsOptionRemovableCallback,
} from '../search-select-utils';

interface UseSearchSelectInternalsConfig<OptionType> {
  showSelected: boolean;
  selected: OptionType[];
  filteredSelected?: OptionType[];
  searchValue: string;
  onSearchChange: (newValue: string) => void;
  options: OptionType[];
  onSelect: (option: OptionType | undefined, remove?: boolean) => void;
  getValue: GetValue<OptionType>;
  renderOption: RenderOption<OptionType>;
  closeListOnSelect: boolean;
  clearSearchOnSelect: boolean;
  onCreate?: SearchSelectOnCreateCallback<OptionType>;
  canCreate: SearchSelectCanCreateCallback;
  renderCreate: SearchSelectRenderCreateCallback;
  isOptionRemovable?: IsOptionRemovableCallback<OptionType>;
  onBackspace?: () => void;
  pinSelectedOptions: boolean;
  formattedSelected?: { value: string | number; label: ReactNode };
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

export function useSearchSelectInternals<OptionType>(
  config: UseSearchSelectInternalsConfig<OptionType>,
): UseSearchSelectInternalsReturn<OptionType> {
  const {
    showSelected,
    selected,
    filteredSelected,
    searchValue,
    onSearchChange,
    options,
    onSelect,
    getValue,
    renderOption,
    closeListOnSelect,
    clearSearchOnSelect,
    onCreate,
    canCreate,
    formattedSelected,
    onBackspace,
    renderCreate,
    isOptionRemovable,
    pinSelectedOptions,
  } = config;

  const [isListOpen, openStateList, closeStateList] = useOnOff(false);
  const [focused, setFocused] = useState(0);
  const [pinnedOptions, setPinnedOptions] = useState<Array<OptionType>>([]);

  const mainRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(mainRef, closeStateList);

  const createValue =
    onCreate && searchValue && canCreate(searchValue) ? searchValue : undefined;

  const formattedOptions = useMemo(
    () =>
      buildInternalOptions(
        options,
        getValue,
        renderOption,
        renderCreate,
        selected,
        showSelected,
        isOptionRemovable,
        createValue,
        filteredSelected,
        formattedSelected,
        pinSelectedOptions,
        pinnedOptions,
      ),
    [
      options,
      getValue,
      renderOption,
      renderCreate,
      createValue,
      selected,
      isOptionRemovable,
      showSelected,
      filteredSelected,
      formattedSelected,
      pinSelectedOptions,
      pinnedOptions,
    ],
  );

  // Always reset focus to the first element if the options list has changed.
  useEffect(() => {
    if (formattedSelected) {
      for (let i = 0; i < options.length; i++) {
        if (formattedSelected.value === getValue(options[i])) {
          setFocused(i);
          return;
        }
      }
    }
    setFocused(0);
  }, [options, formattedSelected, getValue]);

  const { setReferenceElement, setPopperElement, popperProps } =
    useModifiedPopper<HTMLElement>({
      placement: 'bottom',
      offset: 6,
      sameWidth: true,
    });

  function openList() {
    setPinnedOptions(selected.slice());
    openStateList();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isListOpen) {
      openList();
    }
    onSearchChange(event.target.value);
  }

  function selectOption(option: InternalOption<OptionType>): void {
    if (option.type === 'option') {
      if (option.selected) {
        if (option.removable) {
          onSelect(option.originalValue, true);
        }
        // Do not remove if not removable
      } else {
        onSelect(option.originalValue, false);
      }
    } else {
      onCreate?.(option.originalValue, onSelect);
    }
    if (closeListOnSelect) {
      closeStateList();
    }
    if (clearSearchOnSelect) {
      onSearchChange('');
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowUp':
        if (!isListOpen) {
          openList();
        } else {
          const previous = focused - 1;
          setFocused(previous >= 0 ? previous : formattedOptions.length - 1);
        }
        // Prevent moving the input cursor.
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (!isListOpen) {
          openList();
        } else {
          setFocused((focused + 1) % formattedOptions.length);
        }
        // Prevent moving the input cursor.
        event.preventDefault();
        break;
      case 'Escape':
        onSearchChange('');
        if (isListOpen) {
          closeStateList();
        }
        break;
      case 'Enter':
        if (isListOpen && formattedOptions[focused]) {
          selectOption(formattedOptions[focused]);
        }
        // Prevent submitting the form.
        event.preventDefault();
        break;
      case ' ':
        if (searchValue === '') {
          if (isListOpen) {
            closeStateList();
          } else {
            openList();
          }
          event.preventDefault();
        }
        break;
      case 'Backspace':
        if (searchValue === '') {
          onBackspace?.();
        }
        break;
      default:
      // Ignore
    }
  }

  function handleChevronDownClick(event: MouseEvent) {
    if (isListOpen) {
      event.preventDefault();
      closeStateList();
    } else {
      openList();
    }
  }

  function handleXClick(event: MouseEvent) {
    event.preventDefault();
    onSelect(undefined);
  }

  return {
    mainRef,
    closeList: closeStateList,
    openList,
    isListOpen,
    formattedOptions,
    focused,
    setFocused,
    onSelect: selectOption,
    setReferenceElement,
    setPopperElement,
    popperProps,
    handleChange,
    handleKeyDown,
    handleChevronDownClick,
    handleXClick,
    showSelected,
  };
}

function buildInternalOptions<OptionType>(
  // List of options, including the selected ones (duplicated in order to preserve order)
  options: OptionType[],
  getValue: GetValue<OptionType>,
  renderOption: RenderOption<OptionType>,
  renderCreate: SearchSelectRenderCreateCallback,
  selected: OptionType[],
  showSelected: boolean,
  isOptionRemovable?: IsOptionRemovableCallback<OptionType>,
  createValue?: string,

  // list of every filtered options
  filteredSelected?: OptionType[],
  formattedSelected?: { value: string | number; label: ReactNode },
  pinSelectedOptions = false,

  // liste des options sélectionnées au moment de l’ouverture du dropdown filtrés
  pinnedOptions?: Array<OptionType>,
): InternalOption<OptionType>[] {
  const internalOptions: InternalOption<OptionType>[] = [];

  const pinFiltered =
    pinnedOptions?.filter(
      (el) =>
        filteredSelected?.some(
          (filtered) => getValue(filtered) === getValue(el),
        ) || options.some((opt) => getValue(opt) === getValue(el)),
    ) || [];

  if (showSelected) {
    // Start with options which are selected but not in the list (in case of pagination)
    const optionsAdditionnalPinned =
      filteredSelected?.filter(
        (option) => !options?.some((opt) => getValue(opt) === getValue(option)),
      ) || [];

    let renderOptions = [...optionsAdditionnalPinned, ...options];

    if (pinSelectedOptions) {
      // Create 2 array from options, to separate the pinned and not pinned one (if containing in pinFiltered)
      const { pinned, notPinned } = options.reduce<{
        notPinned: Array<OptionType>;
        pinned: Array<OptionType>;
      }>(
        (acc, curr) => {
          const isPinned = pinFiltered.some(
            (option) => getValue(option) === getValue(curr),
          );

          acc[isPinned ? 'pinned' : 'notPinned'].push(curr);
          return acc;
        },
        { notPinned: [], pinned: [] },
      );

      renderOptions = [...optionsAdditionnalPinned, ...pinned, ...notPinned];
    }

    internalOptions.push(
      ...renderOptions.map((option) => {
        const value = getValue(option);
        return {
          type: 'option' as const,
          value: getValue(option),
          label: renderOption(option),
          originalValue: option,
          selected: selected.some(
            (selectedOption) => getValue(selectedOption) === value,
          ),
          removable: isOptionRemovable?.(option) || false,
        };
      }),
    );
  } else {
    const optionsToShow = options.filter((option) => {
      const value = getValue(option);
      return (
        value === formattedSelected?.value ||
        !selected.some((selectedOption) => getValue(selectedOption) === value)
      );
    });
    internalOptions.push(
      ...optionsToShow.map((option) => ({
        type: 'option' as const,
        value: getValue(option),
        label: renderOption(option),
        originalValue: option,
        selected: false,
        removable: isOptionRemovable?.(option) || false,
      })),
    );
  }
  if (createValue) {
    internalOptions.push({
      type: 'create',
      value: '___internal_create___',
      label: renderCreate(createValue),
      originalValue: createValue,
      selected: false,
      removable: false,
    });
  }

  return internalOptions;
}
