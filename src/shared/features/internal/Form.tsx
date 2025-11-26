import React, { useId } from 'react'
import clsx from 'clsx'
import {
  FormContext,
  FormFieldContext,
  useFormContext
} from '~/shared/features/context/form-context'

export type FormProps<T> = {
  className?: string
  defaultValues?: Partial<T>
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>

export function Form<T>(props: FormProps<T>) {
  const { className, defaultValues, children, ...rest } = props
  // form unique id
  const prefix = useId()

  return (
    <FormContext.Provider value={{ defaultValues, prefix }}>
      <form data-prefix={prefix} className={clsx(className)} {...rest}>
        <div className="flex flex-col gap-3">{children}</div>
      </form>
    </FormContext.Provider>
  )
}

export type FormFieldProps<T> = {
  name: keyof T
  label: React.ReactNode
  children?: React.ReactNode
  showErrorMessage?: boolean
  errorMessage?: string
  labelPosition?: 'left' | 'right' | 'top'
}

export function FormField<T>(props: FormFieldProps<T>) {
  const {
    name,
    label,
    children,
    showErrorMessage = false,
    errorMessage,
    labelPosition = 'top'
  } = props
  const { prefix } = useFormContext()
  const fieldId = `${prefix}-${String(name)}`

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
        <label htmlFor={fieldId} className="py-1.5">
          {label}
        </label>
        {children}
        {showErrorMessage && <div>{errorMessage}</div>}
      </div>
    </FormFieldContext.Provider>
  )
}
