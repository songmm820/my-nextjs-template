'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

export type RadioOptionItemType = {
  label: string | React.ReactNode
  value: string
  description?: string | React.ReactNode
}

export type RadioProps = {
  id?: string
  className?: string
  value?: RadioOptionItemType['value']
  options?: Array<RadioOptionItemType>
  onChange?: (value: RadioOptionItemType['value']) => void
}

const BaseRadio = (props: RadioProps) => {
  const { id, className, options, value, onChange } = props
  const uId = useId()

  const oId = (index: number, value: RadioOptionItemType['value']) =>
    id ? `${id}-${String(value)}` : `${uId}-${index}-${String(value)}`

  const isChecked = (optionValue: RadioOptionItemType['value']) => {
    return optionValue == value
  }

  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" tabIndex={0}>
      {options?.map((option, index) => {
        return (
          <div
            key={index}
            role="radio"
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
            onClick={() => onChange?.(option.value)}
          >
            <div aria-hidden="true" className="w-4 h-4 rounded-full border border-primary p-0.5">
              <div
                className={clsx(
                  'w-full h-full rounded-full ',
                  isChecked(option.value) ? 'bg-primary' : 'bg-transparent'
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

const Radio = (props: RadioProps) => {
  return <BaseRadio {...props} />
}

export default Radio
