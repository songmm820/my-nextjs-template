'use client'

import clsx from 'clsx'
import { FormFieldContext, useFormContext } from '~/shared/features/context/form-context'

export type FormFieldProps<T> = {
  name: keyof T
  label?: React.ReactNode
  children?: React.ReactNode
  labelPosition?: 'left' | 'right' | 'top'
}

export function FormField<T>(props: FormFieldProps<T>) {
  const { name, label, children, labelPosition = 'top' } = props
  const { prefix, formInstance } = useFormContext()
  const fieldId = `${prefix}-${String(name)}`

  const { errors } = formInstance.formState
  const errorMessage = errors[name]?.message

  const labelPositionClass: Record<typeof labelPosition, string> = {
    top: 'inline-flex flex-col gap-1.5',
    left: 'inline-flex gap-4',
    right: 'inline-flex flex-row-reverse gap-4'
  }
  const fieldState = formInstance.getFieldState(name as string)
  const isError = fieldState?.invalid

  return (
    <FormFieldContext.Provider
      value={{
        name: name as string,
        fieldId: fieldId
      }}
    >
      <div className={clsx('w-full', labelPositionClass[labelPosition])}>
        {label && (
          <label className="py-1.5 text-base text-666 tracking-widest">
            <div className="inline-flex items-center gap-2">
              <span
                className={clsx(
                  'w-2 h-2 inline-flex rounded-full transition-all duration-300',
                  isError ? 'bg-danger' : 'bg-primary'
                )}
              />
              <span>{label}</span>
            </div>
          </label>
        )}
        {children}
        {Boolean(errorMessage) && <div className="text-danger text-md">{String(errorMessage)}</div>}
      </div>
    </FormFieldContext.Provider>
  )
}
