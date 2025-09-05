import { useState } from 'react';
import { Input } from './Input';

interface Column {
  header: string;
  accessorKey?: string;
  cell?: (props: { row: any }) => string | JSX.Element;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  searchColumn?: string;
}

export function DataTable({ columns, data, searchPlaceholder = "Rechercher...", searchColumn }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = searchColumn
    ? data.filter(item =>
        String(item[searchColumn])
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : data;

  return (
    <div className="space-y-4">
      <Input
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.cell
                      ? column.cell({ row })
                      : row[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
