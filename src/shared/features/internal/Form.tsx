import clsx from 'clsx'
import React from 'react'

export type FormProps = {} & React.FormHTMLAttributes<HTMLFormElement>

export const Form = (props: FormProps) => {
  const { children, ...rest } = props
  return (
    <form {...rest}>
      <div className="flex flex-col gap-3">{children}</div>
    </form>
  )
}

export type FormFieldProps = {
  name: string
  label: React.ReactNode
  children?: React.ReactNode
  labelPosition?: 'left' | 'right' | 'top'
}

export const FormField = (props: FormFieldProps) => {
  const { name, label, children, labelPosition = 'top' } = props

  const labelPositionClass: Record<typeof labelPosition, string> = {
    top: 'inline-flex flex-col gap-1.5',
    left: 'inline-flex gap-4',
    right: 'inline-flex flex-row-reverse gap-4'
  }

  return (
    <div className={clsx('w-fit', labelPositionClass[labelPosition])}>
      <label htmlFor={name} className="py-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
