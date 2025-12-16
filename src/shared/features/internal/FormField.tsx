'use client'

import React from 'react'
import clsx from 'clsx'
import { Controller, type ControllerRenderProps } from 'react-hook-form'
import { FormFieldContext, useFormContext } from '~/shared/features/context/form-context'
import { type ReactElement } from 'react'

export type FormFieldProps<T> = {
  name: keyof T
  label?: React.ReactNode
  children?: ReactElement
  customValueRender?: (renderProps: ControllerRenderProps) => React.ReactElement
}

export function FormField<T>(props: FormFieldProps<T>) {
  const { name, label, children, customValueRender } = props
  const { prefix, formInstance } = useFormContext()
  const fieldId = `${prefix}-${String(name)}`

  const { errors } = formInstance.formState
  const control = formInstance.control
  const fieldState = formInstance.getFieldState(name as string)
  const isError = fieldState?.invalid
  const errorMessage = errors[name]?.message

  return (
    <FormFieldContext.Provider
      value={{
        name: name as string,
        fieldId: fieldId
      }}
    >
      <div className={clsx('w-full')}>
        {label && (
          <div className="py-1.5 text-base text-666">
            <div className="inline-flex items-center gap-2">
              <span
                className={clsx(
                  'w-2 h-2 inline-flex rounded-full transition-all duration-300',
                  isError ? 'bg-danger' : 'bg-primary'
                )}
              />
              <span>{label}</span>
            </div>
          </div>
        )}
        {customValueRender && (
          <Controller
            name={name as string}
            control={control}
            render={(renderProps) => customValueRender(renderProps.field)}
          />
        )}

        {children && (
          <Controller
            name={name as string}
            control={control}
            render={(renderProps) => React.cloneElement(children, renderProps.field)}
          />
        )}

        {Boolean(errorMessage) && <div className="text-danger text-md">{String(errorMessage)}</div>}
      </div>
    </FormFieldContext.Provider>
  )
}
