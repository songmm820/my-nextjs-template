'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'
import { useFormContext, useFormFieldContext } from '~/shared/features/context/form-context'

type OptionItem = {
  label: string | React.ReactNode
  value: string
  description?: string | React.ReactNode
}

export type RadioProps = {
  className?: string
  value?: OptionItem['value']
  options?: Array<OptionItem>
  onChange?: (value: OptionItem['value']) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const BaseRadio = (props: RadioProps) => {
  const { id, className, options, value, onChange, ...rest } = props
  const uId = useId()

  const oId = (index: number, value: OptionItem['value']) =>
    id ? `${id}-${String(value)}` : `${uId}-${index}-${String(value)}`

  return (
    <div className="flex flex-wrap gap-3">
      {options?.map((option, index) => {
        return (
          <label key={index} htmlFor={oId(index, option.value)}>
            <input
              type="radio"
              id={oId(index, option.value)}
              hidden
              className={twMerge(clsx('', className))}
              {...rest}
              onClick={() => onChange?.(option.value)}
            />
            <div
              className={clsx(
                'px-4 py-2.5 min-w-42 border rounded-md',
                'flex gap-4 items-center cursor-pointer',
                value == option.value ? 'border-primary' : 'border-e7'
              )}
            >
              <div className="w-4 h-4 rounded-full border border-primary p-0.5">
                <div className="w-full h-full rounded-full bg-primary"></div>
              </div>
              <div className="flex flex-col">
                <div className="text-666 text-md">{option.label}</div>
                {option.description && <div className="text-999 text-sm">{option.description}</div>}
              </div>
            </div>
          </label>
        )
      })}
    </div>
  )
}

const Radio = (props: RadioProps) => {
  const { id, ...rest } = props
  const formCtx = useFormContext()
  const formFieldCtx = useFormFieldContext()
  const isInForm = formCtx && formFieldCtx

  if (!isInForm) {
    return <BaseRadio id={id} {...rest} autoComplete="off" />
  } else {
    const { initialValues, formInstance } = formCtx
    const { fieldId, name } = formFieldCtx
    const defaultValue = initialValues?.[name]
    const value = formInstance.watch(name)
    return (
      <BaseRadio
        id={id || fieldId}
        defaultValue={defaultValue}
        value={value}
        autoComplete="off"
        {...formInstance.register(name)}
        {...rest}
        onChange={(val) => formInstance.setValue(name, val, { shouldValidate: true })}
      />
    )
  }
}

export default Radio
