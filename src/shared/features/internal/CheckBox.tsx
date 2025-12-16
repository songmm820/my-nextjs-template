'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

export type CheckBoxOptionItemType = {
  label: string | React.ReactNode
  value: string
  description?: string | React.ReactNode
}

export type CheckBoxProps = {
  id?: string
  className?: string
  value?: Array<CheckBoxOptionItemType['value']>
  options?: Array<CheckBoxOptionItemType>
  onChange?: (value: Array<CheckBoxOptionItemType['value']>) => void
}

const BaseCheckBox = (props: CheckBoxProps) => {
  const { id, className, options, value, onChange } = props
  const uId = useId()

  const oId = (index: number, value: CheckBoxOptionItemType['value']) =>
    id ? `${id}-${String(value)}` : `${uId}-${index}-${String(value)}`

  const isChecked = (optionValue: CheckBoxOptionItemType['value']) => {
    return value?.includes(optionValue)
  }

  const handleCheckBoxChange = (optionValue: CheckBoxOptionItemType['value']) => {
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
  return <BaseCheckBox {...props} />
}

export default CheckBox
