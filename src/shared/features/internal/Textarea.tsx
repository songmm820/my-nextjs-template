'use client'

import { useEffect, useId, useRef } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export type TextareaProps = {
  className?: string
  rows?: number
  onChange?: (val: string) => void
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>

const BaseTextarea = (props: TextareaProps) => {
  const { id, rows = 5, value, className, onChange, ...rest } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const uId = useId()
  const inputId = id ?? uId

  useEffect(() => {
    // 自动撑开高度
    if (!textareaRef.current || !value) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 12}px`

    return () => {
      textareaRef.current?.style.removeProperty('height')
    }
  }, [value])

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      id={inputId}
      value={value}
      rows={rows}
      className={twMerge(
        clsx(
          [
            'w-full px-4 py-2 rounded-md text-md text-666 overflow-auto',
            'border border-transparent transition-colors duration-300',
            'bg-[#f5f5f5] focus-visible:border-primary focus-visible:bg-white',
            'placeholder:text-999'
          ],
          className
        )
      )}
      onChange={(e) => onChange?.(e.target.value)}
    />
  )
}

const Textarea = (props: TextareaProps) => {
  return <BaseTextarea {...props} />
}

export default Textarea
