'use client'

import { ReactNode } from 'react'

interface Column<T> {
  key: keyof T | (string & {})
  label: string
  sticky?: boolean
  render?: (row: T) => ReactNode
  actions?: (ctx: { row: T; id: any }) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
}

export default function Table<T>({ columns, data, keyExtractor }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap ${col.sticky ? 'sticky left-0 z-10 bg-gray-50' : ''
                  }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                No data
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = (row as any).id

              return (
                <tr key={keyExtractor(row)} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-gray-700 whitespace-nowrap ${col.sticky ? 'sticky left-0 z-10 bg-white' : ''
                        }`}
                    >
                      {col.actions
                        ? col.actions({ row, id })
                        : col.render
                          ? col.render(row)
                          : String((row as any)[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
