/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react'

/** ******************* Form ******************** */

type FormContextType<T extends Record<string, any>> = {
  defaultValues?: Partial<T>
  prefix?: string
}

// This context is used to pass the prefix to the form components
export const FormContext = createContext<FormContextType<any> | null>(null)

export const useFormContext = <T extends Record<string, any>>() => {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }

  return context as FormContextType<T>
}
/** ******************* Form Field ******************** */

type FormFieldContextType = {
  fieldId: string
  name: string
}

// This context is used to pass the name to the form field components
export const FormFieldContext = createContext<FormFieldContextType | null>(null)

export const useFormFieldContext = () => {
  const context = useContext(FormFieldContext)

  if (!context) {
    throw new Error('useFormFieldContext must be used within a FormFieldProvider')
  }

  return context
}
