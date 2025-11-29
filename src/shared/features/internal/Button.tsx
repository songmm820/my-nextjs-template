import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import Icon from '~/shared/components/Icon'

export type ButtonProps = {
  className?: string
  variant?: 'primary' | 'outline' | 'default' | 'link'
  block?: boolean
  loading?: boolean
  onClick?: () => void
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onSubmit'>

const LoadingIcon = () => {
  return <Icon className="animate-spin" color="#fff" size={18} name="loading-four" />
}

const Button = (props: ButtonProps) => {
  const {
    className,
    variant = 'default',
    block = false,
    loading = false,
    children,
    disabled = false,
    onClick,
    ...rest
  } = props

  if (variant === 'link') {
    return (
      <div
        role="button"
        className={clsx(
          'text-primary hover:brightness-90 transition-all duration-300',
          'inline-flex items-center justify-center',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-90'
        )}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      className={twMerge(
        clsx(
          'h-11 rounded-lg font-medium transition-all duration-300',
          block ? 'w-full' : 'w-31',
          variant === 'default' && 'bg-[#f0f0f0]',
          variant === 'primary' && 'bg-primary text-white ',
          variant === 'outline' && 'border border-primary text-primary',
          disabled ? 'cursor-not-allowed' : 'hover:brightness-90 cursor-pointer',
          className
        )
      )}
      disabled={disabled}
      {...rest}
      onClick={onClick}
    >
      <span className="inline-flex justify-center items-center gap-2">
        {loading && <LoadingIcon />}
        {children}
      </span>
    </button>
  )
}

export default Button
