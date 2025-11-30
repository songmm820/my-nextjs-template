/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from 'react'
import type { UseFormReturn } from 'react-hook-form'

/** ******************* Form ******************** */

type FormContextType<T extends Record<string, any>> = {
  prefix?: string
  initialValues?: Partial<T>
  formInstance: UseFormReturn<T>
}

// This context is used to pass the prefix to the form components
export const FormContext = createContext<FormContextType<any> | null>(null)

export const useFormContext = <T extends Record<string, any>>() => {
  const context = useContext(FormContext)
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
  return useContext(FormFieldContext)
}
