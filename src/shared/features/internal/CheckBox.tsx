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

export type CheckBoxProps = {
  id?: string
  className?: string
  value?: Array<OptionItem['value']>
  options?: Array<OptionItem>
  onChange?: (value: Array<OptionItem['value']>) => void
}

const BaseCheckBox = (props: CheckBoxProps) => {
  const { id, className, options, value, onChange } = props
  const uId = useId()

  const oId = (index: number, value: OptionItem['value']) =>
    id ? `${id}-${String(value)}` : `${uId}-${index}-${String(value)}`

  const isChecked = (optionValue: OptionItem['value']) => {
    return value?.includes(optionValue)
  }

  const handleCheckBoxChange = (optionValue: OptionItem['value']) => {
    if (isChecked(optionValue)) {
      // remove
      onChange?.(value?.filter((val) => val !== optionValue) || [])
    } else {
      // add
      onChange?.([...(value || []), optionValue])
    }
  }

  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" tabIndex={0}>
      {options?.map((option, index) => {
        return (
          <div
            key={index}
            role="checkbox"
            aria-checked={isChecked(option.value)}
            id={oId(index, option.value)}
            tabIndex={0}
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
            onClick={() => handleCheckBoxChange(option.value)}
          >
            <div aria-hidden="true" className="w-4 h-4 rounded-sm border border-primary p-0.5">
              <div
                className={clsx(
                  'w-full h-full rounded-sm ',
                  isChecked(option.value) ? 'bg-primary' : 'bg-white'
                )}
              ></div>
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

const CheckBox = (props: CheckBoxProps) => {
  const { id, ...rest } = props
  const formCtx = useFormContext()
  const formFieldCtx = useFormFieldContext()
  const isInForm = formCtx && formFieldCtx

  if (!isInForm) {
    return <BaseCheckBox id={id} {...rest} />
  } else {
    const { formInstance } = formCtx
    const { fieldId, name } = formFieldCtx
    const value = formInstance.watch(name)
    return (
      <BaseCheckBox
        id={id || fieldId}
        value={value}
        {...rest}
        onChange={(val) => formInstance.setValue(name, val, { shouldValidate: true })}
      />
    )
  }
}

export default CheckBox
