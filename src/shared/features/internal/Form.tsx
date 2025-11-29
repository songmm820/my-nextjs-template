import React, { forwardRef, type JSX, type Ref, useEffect, useId, useImperativeHandle } from 'react'
import clsx from 'clsx'
import { type ZodType } from 'zod'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type UseFormReturn,
  useWatch
} from 'react-hook-form'
import { FormContext } from '~/shared/features/context/form-context'
import { zodResolver } from '@hookform/resolvers/zod'

type FormComponent = {
  <T extends FieldValues>(props: FormProps<T> & { ref?: React.Ref<FormRef<T>> }): JSX.Element
  displayName?: string
}

export type FormProps<T extends FieldValues> = {
  className?: string
  initialValues?: DefaultValues<T>
  schema?: ZodType<T, T> | undefined | null
  onValueChange?: (values: T) => void
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>

export type FormRef<T extends FieldValues> = {
  formInstance: UseFormReturn<T>
  reset: () => void
  validate: () => Promise<boolean>
  focusField: (name: Path<T>) => void
  getFormValues: () => T
  getFieldValue: (name: Path<T>) => T[keyof T]
}

const Form = forwardRef(<T extends FieldValues>(props: FormProps<T>, ref: Ref<FormRef<T>>) => {
  const { className, schema, initialValues, children, onValueChange, ...rest } = props

  const prefix = useId()
  const resolver = schema ? zodResolver(schema) : undefined
  const formInstance: UseFormReturn<T> = useForm<T>({
    resolver: resolver,
    defaultValues: initialValues,
    mode: 'onBlur'
  })

  const liveValues = useWatch({ control: formInstance.control })

  useEffect(() => {
    if (onValueChange) onValueChange(liveValues as T)
  }, [liveValues, onValueChange])

  const focusField = async (name: Path<T>) => {
    await formInstance.trigger(name)
  }

  const reset = () => {
    formInstance.reset(initialValues)
  }

  const validate = async () => {
    const tr = await formInstance.trigger()
    if (!tr) {
      // eslint-disable-next-line no-console
      console.error('The Form has error: ', formInstance.formState.errors)
    }
    return tr
  }

  const getFormValues = () => {
    return formInstance.getValues()
  }

  const getFieldValue = (name: Path<T>) => {
    return formInstance.getValues(name)
  }

  useImperativeHandle(ref, () => ({
    formInstance,
    reset,
    validate,
    focusField,
    getFormValues,
    getFieldValue
  }))

  return (
    <FormContext.Provider value={{ initialValues, prefix, formInstance }}>
      <form
        data-prefix={prefix}
        className={clsx(className)}
        onSubmit={(e) => e.preventDefault()}
        {...rest}
      >
        <div className="flex flex-col gap-3">{children}</div>
      </form>
    </FormContext.Provider>
  )
}) as FormComponent

Form.displayName = 'Form'

export default Form
