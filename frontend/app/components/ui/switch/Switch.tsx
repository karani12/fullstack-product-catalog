'use client'

import { forwardRef } from 'react'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ checked, onChange, disabled, label }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        {label && <span className="text-sm text-gray-600">{label}</span>}

        <span className="relative inline-flex items-center">
          <input
            ref={ref}
            type="checkbox"
            checked={!!checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />

          {/* track */}
          <span
            className={`
              w-10 h-5 rounded-full transition-colors
              ${checked ? 'bg-green-500' : 'bg-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* thumb */}
          <span
            className={`
              absolute left-0 top-0 h-5 w-5 bg-white rounded-full shadow transform transition-transform
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </span>
      </label>
    )
  }
)

Switch.displayName = 'Switch'
