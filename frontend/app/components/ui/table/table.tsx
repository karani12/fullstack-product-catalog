/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full min-w-max text-sm">
        <thead className="border-b bg-background">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left font-medium whitespace-nowrap bg-background ${
                  col.sticky ? 'sticky left-0 z-10' : ''
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center">
                No data
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = (row as any).id

              return (
                <tr key={keyExtractor(row)} className="transition-colors">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 whitespace-nowrap bg-background ${
                        col.sticky ? 'sticky left-0 z-10' : ''
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
