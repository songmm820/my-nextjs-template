'use client'

import { useRef } from 'react'
import { Button, Form, FormField, Input } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { authSignSchema, type AuthSignSchemaInput } from '~/shared/zod-schemas/auth.schema'
import { useRouter } from 'next/navigation'

const SignInPage = () => {
  const router = useRouter()

  const formRef = useRef<FormRef<AuthSignSchemaInput>>(null)

  const onSubmit = async () => {
    const isV = await formRef.current?.validate()
    if (!isV) return
    const values = formRef.current?.getFormValues()
    alert(JSON.stringify(values))
    router.push('/')
  }

  return (
    <div className="max-w-300 h-full overflow-hidden">
      <div className="mt-26 w-100 mx-auto">
        <Form<AuthSignSchemaInput> ref={formRef} schema={authSignSchema}>
          <FormField<AuthSignSchemaInput> name="email" label="Please input your email">
            <Input type="text" placeholder="Email" autoComplete="on" />
          </FormField>

          <FormField<AuthSignSchemaInput> name="password" label="Please input your password">
            <Input type="password" placeholder="Password" autoComplete="on" />
          </FormField>
        </Form>

        <Button className="mt-6" variant="primary" block onClick={onSubmit}>
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default SignInPage
