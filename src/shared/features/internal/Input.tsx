import clsx from 'clsx'
import { useFormContext, useFormFieldContext } from '~/shared/features/context/form-context'

export type InputProps = {} & React.InputHTMLAttributes<HTMLInputElement>

const Input = (props: InputProps) => {
  const { id, ...rest } = props
  const { defaultValues } = useFormContext()
  const { name, fieldId } = useFormFieldContext()
  const defaultValue = defaultValues?.[name]

  return (
    <input
      id={id || fieldId}
      defaultValue={defaultValue}
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
      {...rest}
      autoComplete="off"
    />
  )
}

export default Input
