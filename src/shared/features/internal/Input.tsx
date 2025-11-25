import clsx from 'clsx'

export type InputProps = {} & React.InputHTMLAttributes<HTMLInputElement>

const Input = (props: InputProps) => {
  return (
    <input
      className={clsx([
        'h-11',
        'bg-[#f0f0f0]',
        'px-4',
        'rounded-lg',

        'focus-visible:ring-1',
        'focus-visible:ring-primary',
        'focus-visible:bg-white',

        'transition-all',
        'duration-300'
      ])}
      {...props}
      autoComplete="off"
    />
  )
}

export default Input
