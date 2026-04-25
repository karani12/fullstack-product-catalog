import { InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  registration?: UseFormRegisterReturn
  label?: string
  error?: string
}

export function Input({
  registration,
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-1 text-gray-700">
          {label}
        </label>
      )}

      <input
        {...registration}
        {...props}
        className={`w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 ${className}`}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
