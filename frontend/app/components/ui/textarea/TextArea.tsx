import { TextareaHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  registration?: UseFormRegisterReturn
  label?: string
  error?: string
}

export function Textarea({ registration, label, error, className = '', ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm mb-1">{label}</label>}

      <textarea
        {...registration}
        {...props}
        className={`w-full border  rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none ${className}`}
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
