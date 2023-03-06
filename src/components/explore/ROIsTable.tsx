import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import ImageViewer from '../ImageViewer';

export default function ROIsTable(props: { data: any[] }) {
  const { data = [] } = props;

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor('crop', {
      header: () => 'Crop',
      cell: (info) => <ImageViewer image={info.getValue()} zoom={0.4} />,
    }),
    columnHelper.accessor('width', {
      header: () => 'Width',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('height', {
      header: () => 'Height',
    }),
    columnHelper.accessor('hull.surface', {
      header: () => 'Hull surface',
      cell: (info) => info.getValue().toFixed(0),
    }),
    columnHelper.accessor('mbr.surface', {
      header: () => 'MBR surface',
      cell: (info) => info.getValue().toFixed(0),
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
