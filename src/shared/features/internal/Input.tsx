'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFormContext, useFormFieldContext } from '~/shared/features/context/form-context'

export type InputProps = {
  error?: boolean
  defaultValue?: string
  className?: string
  onChange?: (val: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const BaseInput = (props: InputProps) => {
  const { id, defaultValue, error, className, onChange, ...rest } = props
  const uId = useId()
  const inputId = id ?? uId
  return (
    <input
      id={inputId}
      defaultValue={defaultValue}
      className={twMerge(
        clsx(
          [
            'h-11',
            'px-4',
            'rounded-md text-md text-666',
            error
              ? 'ring-1 ring-danger bg-white'
              : 'bg-[#f0f0f0] focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white',
            'transition-all duration-300 placeholder:text-999'
          ],
          className
        )
      )}
      {...rest}
      autoComplete="off"
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

const Input = (props: InputProps) => {
  const { id, error, ...rest } = props
  const formCtx = useFormContext()
  const formFieldCtx = useFormFieldContext()
  const isInForm = formCtx && formFieldCtx

  if (!isInForm) {
    const errorStatus = error ?? false
    return <BaseInput id={id} error={errorStatus} {...rest} autoComplete="off" />
  } else {
    const { initialValues, formInstance } = formCtx
    const { fieldId, name } = formFieldCtx
    const errorStatus = Boolean(error ?? formInstance.formState.errors[name]?.message)
    const defaultValue = initialValues?.[name]
    const value = formInstance.watch(name)
    return (
      <BaseInput
        id={id || fieldId}
        error={errorStatus}
        defaultValue={defaultValue}
        value={value}
        autoComplete="off"
        {...rest}
        {...formInstance.register(name)}
        onChange={(val) => formInstance.setValue(name, val, { shouldValidate: true })}
      />
    )
  }
}

export default Input
