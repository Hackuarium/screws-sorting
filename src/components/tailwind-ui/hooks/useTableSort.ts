import { useReducer } from 'react';

import { delve } from '../util';

export const TableSortDirection = {
  ASCENDING: 'ASCENDING',
  DESCENDING: 'DESCENDING',
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type TableSortDirection =
  (typeof TableSortDirection)[keyof typeof TableSortDirection];

export type TableSortChangeCallback = (field: string) => void;

export interface TableSortHookOptions {
  initialSortDirection?: TableSortDirection;
  initialSortField?: string | null;
}

export interface TableSortConfig {
  field: string | null;
  direction: TableSortDirection;
  onChange: TableSortChangeCallback;
}

export interface TableSortHookResult<T> {
  data: Array<T>;
  sort: TableSortConfig;
}

interface TableSortState {
  sortField: string | null;
  sortDirection: TableSortDirection;
}

function tableSortReducer(
  state: TableSortState,
  payload: string,
): TableSortState {
  const field = payload;

  if (state.sortField === field) {
    if (state.sortDirection === TableSortDirection.DESCENDING) {
      return {
        sortField: null,
        sortDirection: TableSortDirection.ASCENDING,
      };
    } else {
      return {
        ...state,
        sortDirection: TableSortDirection.DESCENDING,
      };
    }
  } else {
    return {
      sortField: field,
      sortDirection: TableSortDirection.ASCENDING,
    };
  }
}

export function useTableSort<T extends object>(
  data: Array<T>,
  options: TableSortHookOptions,
): TableSortHookResult<T> {
  const {
    initialSortDirection = TableSortDirection.ASCENDING,
    initialSortField = null,
  } = options;

  const [{ sortField, sortDirection }, dispatch] = useReducer(
    tableSortReducer,
    {
      sortField: initialSortField,
      sortDirection: initialSortDirection,
    },
  );

  let finalData = data;
  // Apply sort config.
  if (sortField) {
    finalData = sortData(finalData.slice(), sortField, sortDirection);
  }

  return {
    data: finalData,
    sort: {
      field: sortField,
      direction: sortDirection,
      onChange(field) {
        dispatch(field);
      },
    },
  };
}

type Comparator = (value1: unknown, value2: unknown) => number;
type ComparatorType = 'string' | 'number' | 'boolean' | 'date';

const comparators: Record<ComparatorType, Comparator> = {
  string: (value1, value2) => String(value1).localeCompare(String(value2)),
  number: (value1, value2) => Number(value1) - Number(value2),
  // We already know that value1 is not equal to value2 at this point.
  boolean: (value1) => -Number(value1),
  date: (value1, value2) => Number(value1) - Number(value2),
};

function getComparator(value: unknown) {
  const valueType = typeof value;
  if (
    valueType === 'string' ||
    valueType === 'number' ||
    valueType === 'boolean'
  ) {
    return comparators[valueType];
  }
  if (valueType === 'object' && value instanceof Date) {
    return comparators.date;
  }
  throw new TypeError('Unsupported value type to sort');
}

function sortData<DataType extends object>(
  data: DataType[],
  sortField: string,
  sortDirection: TableSortDirection,
): DataType[] {
  const key = sortField.split('.');
  let comparator: Comparator;
  const sorted = data.sort((elem1, elem2) => {
    const value1 = delve(elem1, key);
    const value2 = delve(elem2, key);
    if (value1 === value2) return 0;
    if (value1 === null || value1 === undefined || value1 === '') {
      return 1;
    }
    if (value2 === null || value2 === undefined || value2 === '') {
      return -1;
    }
    if (!comparator) {
      // Assume that fields do not mix types.
      comparator = getComparator(value1);
    }
    return comparator(value1, value2);
  });
  return sortDirection === TableSortDirection.ASCENDING
    ? sorted
    : sorted.reverse();
}
