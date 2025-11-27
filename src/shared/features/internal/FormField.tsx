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

  return (
    <FormFieldContext.Provider
      value={{
        name: name as string,
        fieldId: fieldId
      }}
    >
      <div className={clsx('w-full', labelPositionClass[labelPosition])}>
        {label && (
          <label htmlFor={fieldId} className="py-1.5 text-base text-666">
            {label}
          </label>
        )}
        {children}
        {Boolean(errorMessage) && <div className="text-danger text-md">{String(errorMessage)}</div>}
      </div>
    </FormFieldContext.Provider>
  )
}
