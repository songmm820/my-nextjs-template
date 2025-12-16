'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

export type TextareaProps = {
  className?: string
  rows?: number
  onChange?: (val: string) => void
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>

const BaseTextarea = (props: TextareaProps) => {
  const { id, rows = 5, className, onChange, ...rest } = props
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
            'bg-[#f5f5f5] focus-visible:border-primary focus-visible:bg-white',
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
  return <BaseTextarea {...props} />
}

export default Textarea
