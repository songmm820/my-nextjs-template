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
  id?: string
  className?: string
  value?: OptionItem['value']
  options?: Array<OptionItem>
  onChange?: (value: OptionItem['value']) => void
}

const BaseRadio = (props: RadioProps) => {
  const { id, className, options, value, onChange } = props
  const uId = useId()

  const oId = (index: number, value: OptionItem['value']) =>
    id ? `${id}-${String(value)}` : `${uId}-${index}-${String(value)}`

  const isChecked = (optionValue: OptionItem['value']) => {
    return optionValue == value
  }

  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" tabIndex={0}>
      {options?.map((option, index) => {
        return (
          <div
            key={option.value}
            role="radio"
            aria-checked={isChecked(option.value)}
            id={oId(index, option.value)}
            tabIndex={isChecked(option.value) ? 0 : -1}
            className={twMerge(
              clsx(
                'px-4 py-2.5 min-w-42 rounded-md',
                'flex gap-4 items-center cursor-pointer bg-primary/2 hover:bg-primary/5',
                isChecked(option.value)
                  ? 'bg-primary/5 border border-primary/75'
                  : 'border border-primary/20'
              ),
              className
            )}
            onClick={() => onChange?.(option.value)}
          >
            <div className="w-4 h-4 rounded-full border border-primary p-0.5">
              <div className="w-full h-full rounded-full bg-primary"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-666 text-md">{option.label}</div>
              {option.description && <div className="text-999 text-sm">{option.description}</div>}
            </div>
          </div>
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
    return <BaseRadio id={id} {...rest} />
  } else {
    const { formInstance } = formCtx
    const { fieldId, name } = formFieldCtx
    const value = formInstance.watch(name)
    return (
      <BaseRadio
        id={id || fieldId}
        value={value}
        {...rest}
        onChange={(val) => formInstance.setValue(name, val, { shouldValidate: true })}
      />
    )
  }
}

export default Radio
