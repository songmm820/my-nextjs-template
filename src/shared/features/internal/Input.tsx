import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFormContext, useFormFieldContext } from '~/shared/features/context/form-context'

export type InputProps = {
  error?: boolean
  defaultValue?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const BaseInput = (props: InputProps) => {
  const { id, defaultValue, error, className, ...rest } = props
  return (
    <input
      id={id}
      defaultValue={defaultValue}
      className={twMerge(
        clsx(
          [
            'h-11',
            'px-4',
            'rounded-lg text-md text-666',
            error
              ? 'ring-1 ring-danger bg-white'
              : 'bg-[#f0f0f0] focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white',
            'transition-all duration-300 placeholder:text-999'
          ],
          className
        )
      )}
      {...rest}
      autoComplete="off"
    />
  )
}

const Input = (props: InputProps) => {
  const { id, error, ...rest } = props
  const formCtx = useFormContext()
  const formFieldCtx = useFormFieldContext()
  const isInForm = formCtx && formFieldCtx

  if (!isInForm) {
    const errorStatus = error ?? false
    return <BaseInput id={id} error={errorStatus} {...rest} autoComplete="off" />
  } else {
    const { initialValues, formInstance } = formCtx
    const { fieldId, name } = formFieldCtx
    const errorStatus = Boolean(error ?? formInstance.formState.errors[name]?.message)
    const defaultValue = initialValues?.[name]
    return (
      <BaseInput
        id={id || fieldId}
        error={errorStatus}
        {...formInstance.register(name)}
        defaultValue={defaultValue}
        {...rest}
        autoComplete="off"
      />
    )
  }
}

export default Input
