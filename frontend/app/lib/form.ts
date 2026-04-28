import { UseFormSetError, FieldValues, Path } from 'react-hook-form'

export function applyServerErrors<T extends FieldValues>(
  errors: Record<string, string[]>,
  setError: UseFormSetError<T>,
  validFields?: string[]
) {
  Object.entries(errors).forEach(([field, messages]) => {
    if (validFields && !validFields.includes(field)) return
    setError(field as Path<T>, {
      type: 'server',
      message: messages[0],
    })
  })
}
