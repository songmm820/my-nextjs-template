'use client'

import clsx from 'clsx'
import { useId } from 'react'
import { twMerge } from 'tailwind-merge'

export type InputProps = {
  className?: string
  onChange?: (val: string) => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const BaseInput = (props: InputProps) => {
  const { id, className, value, onChange, ...rest } = props
  const uId = useId()
  const inputId = id ?? uId
  return (
    <input
      id={inputId}
      className={twMerge(
        clsx(
          [
            'w-full h-11 px-4 rounded-md text-md text-666 ',
            'transition-colors border border-transparent',
            'bg-[#f5f5f5] focus-visible:border-primary focus-visible:bg-white',
            'transition-all duration-300 placeholder:text-999'
          ],
          className
        )
      )}
      value={value ?? ''}
      {...rest}
      autoComplete="off"
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

const Input = (props: InputProps) => {
  return <BaseInput {...props} />
}

export default Input
