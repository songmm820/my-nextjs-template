import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export type ButtonProps = {
  className?: string
  variant?: 'primary' | 'outline' | 'default'
  block?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: ButtonProps) => {
  const { className, variant = 'default', block = false, children, ...rest } = props

  return (
    <button
      className={twMerge(
        clsx(
          'h-11 cursor-pointer rounded-lg hover:brightness-90 transition-all duration-300',
          block ? 'w-full' : 'w-31',
          variant === 'default' && 'bg-[#f0f0f0]',
          variant === 'primary' && 'bg-primary text-white ',
          variant === 'outline' && 'border border-primary text-primary',
          className
        )
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
