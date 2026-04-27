import { SelectHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type Option = {
  label: string
  value: string | number
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  registration?: UseFormRegisterReturn
  label?: string
  error?: string
  options: Option[]
}

export function Select({ registration, label, error, options, className = '', ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm mb-1">{label}</label>}

      <select
        {...registration}
        {...props}
        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
