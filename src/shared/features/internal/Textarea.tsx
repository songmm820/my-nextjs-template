'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFormContext, useFormFieldContext } from '~/shared/features/context/form-context'

export type TextareaProps = {
  error?: boolean
  className?: string
  rows?: number
  onChange?: (val: string) => void
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>

const BaseTextarea = (props: TextareaProps) => {
  const { id, rows = 5, error, className, onChange, ...rest } = props
  const uId = useId()
  const inputId = id ?? uId
  return (
    <textarea
      id={inputId}
      rows={rows}
      className={twMerge(
        clsx(
          [
            'min-h-16 px-4 py-2 rounded-md text-md text-666 overflow-auto',
            'border border-transparent transition-colors duration-300',
            error
              ? 'border-danger bg-white'
              : 'bg-[#f5f5f5] focus-visible:border-primary focus-visible:bg-white',
            'placeholder:text-999'
          ],
          className
        )
      )}
      {...rest}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

const Textarea = (props: TextareaProps) => {
  const { id, error, ...rest } = props
  const formCtx = useFormContext()
  const formFieldCtx = useFormFieldContext()
  const isInForm = formCtx && formFieldCtx

  if (!isInForm) {
    const errorStatus = error ?? false
    return <BaseTextarea id={id} error={errorStatus} {...rest} autoComplete="off" />
  } else {
    const { formInstance } = formCtx
    const { fieldId, name } = formFieldCtx
    const errorStatus = Boolean(error ?? formInstance.formState.errors[name]?.message)
    const value = formInstance.watch(name) ?? ''
    return (
      <BaseTextarea
        id={id || fieldId}
        error={errorStatus}
        value={value}
        {...rest}
        onChange={(val) => formInstance.setValue(name, val, { shouldValidate: true })}
      />
    )
  }
}

export default Textarea
