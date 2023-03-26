import { useEffect, useState } from 'react';

import { PaginationProps } from '../elements/pagination/Pagination';

import {
  TableSortConfig,
  TableSortDirection,
  useTableSort,
} from './useTableSort';

export interface TableHookOptions {
  initialPage?: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
  pagesPerSide?: number;
  withText?: boolean;
  initialSortField?: string;
  initialSortDirection?: TableSortDirection;
}

export interface TableHookResult<T> {
  pagination: PaginationProps;
  data: Array<T>;
  sort: TableSortConfig;
}

export function useTable<T extends object>(
  data: Array<T>,
  options: TableHookOptions = {},
): TableHookResult<T> {
  const {
    itemsPerPage = 10,
    initialPage = 0,
    initialSortField = null,
    initialSortDirection = TableSortDirection.ASCENDING,
    maxVisiblePages,
    pagesPerSide,
    withText,
  } = options;

  const [page, setPage] = useState(initialPage);
  const { data: sortedData, sort } = useTableSort(data, {
    initialSortDirection,
    initialSortField,
  });

  useEffect(() => {
    // Reset the page when the data length changes.
    setPage(initialPage);
  }, [data.length, initialPage]);

  // Apply pagination.
  const first = page * itemsPerPage;
  const last = first + itemsPerPage;

  return {
    data: sortedData.slice(first, last),
    pagination: {
      centerPagesPerSide: maxVisiblePages,
      boundaryPagesPerSide: pagesPerSide,
      withText,
      page,
      itemsPerPage,
      totalCount: data.length,
      onPageChange: setPage,
    },
    sort,
  };
}
