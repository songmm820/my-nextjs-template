import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import Icon from '~/shared/components/Icon'

export type ButtonProps = {
  className?: string
  variant?: 'primary' | 'outline' | 'default'
  block?: boolean
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const LoadingIcon = () => {
  return <Icon className='animate-spin' color="#fff" size={18} name="loading-four" />
}

const Button = (props: ButtonProps) => {
  const {
    className,
    variant = 'default',
    block = false,
    loading = false,
    children,
    disabled = false,
    ...rest
  } = props

  return (
    <button
      className={twMerge(
        clsx(
          'h-11 cursor-pointer rounded-lg font-medium transition-all duration-300',
          block ? 'w-full' : 'w-31',
          variant === 'default' && 'bg-[#f0f0f0]',
          variant === 'primary' && 'bg-primary text-white ',
          variant === 'outline' && 'border border-primary text-primary',
          disabled ? 'cursor-not-allowed' : 'hover:brightness-90',
          className
        )
      )}
      disabled={disabled}
      {...rest}
    >
      <span className="inline-flex justify-center items-center gap-2">
        {loading && <LoadingIcon />}
        {children}
      </span>
    </button>
  )
}

export default Button
