import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Roi } from 'image-js';

import ImageViewer from '../ImageViewer';

export default function ROIsTable(props: { data: Roi[] }) {
  const { data = [] } = props;

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor('crop', {
      header: () => 'Crop',
      cell: (info) => <ImageViewer image={info.getValue()} zoom={0.4} />,
    }),
    columnHelper.accessor('id', {
      header: () => 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('origin.column', {
      header: () => 'Column',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('origin.row', {
      header: () => 'Row',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('width', {
      header: () => 'Width',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('height', {
      header: () => 'Height',
    }),
    columnHelper.accessor('feret.aspectRatio', {
      header: () => 'Aspect Ratio (feret)',
      cell: (info) => info.getValue().toFixed(2),
    }),

    columnHelper.accessor('feret.minDiameter.length', {
      header: () => 'Feret minDiameter',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('feret.maxDiameter.length', {
      header: () => 'Feret maxDiameter',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('roundness', {
      header: () => 'Roundness',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('solidity', {
      header: () => 'Solidity',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('sphericity', {
      header: () => 'Sphericity',
      cell: (info) => info.getValue().toFixed(2),
    }),
    columnHelper.accessor('fillRatio', {
      header: () => 'Fill ratio',
      cell: (info) => info.getValue().toFixed(2),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
