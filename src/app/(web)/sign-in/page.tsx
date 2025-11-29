'use client'

import { useRef } from 'react'
import { Button, Form, FormField, Input } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { authSignSchema, type AuthSignSchemaInput } from '~/shared/zod-schemas/auth.schema'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInApi } from '~/apis/auth'
import { setCookie } from 'cookies-next/client'
import { AUTHORIZATION, type NavRouteHrefType } from '~/shared/constants'

const SignInPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') as NavRouteHrefType
  const formRef = useRef<FormRef<AuthSignSchemaInput>>(null)

  const onSubmit = async () => {
    const isV = await formRef.current?.validate()
    if (!isV) return
    const values = formRef.current?.getFormValues()
    if (!values) return
    const { data } = await signInApi(values)
    setCookie(AUTHORIZATION, data)
    router.push(redirect ?? '/')
  }

  return (
    <div className="max-full h-full overflow-hidden">
      <div className="mt-26 w-100 mx-auto">
        <Form<AuthSignSchemaInput>
          ref={formRef}
          schema={authSignSchema}
          initialValues={{
            email: 'mmsong@yeah.net',
            captcha: '1345',
            password: '12345678'
          }}
        >
          <FormField<AuthSignSchemaInput> name="email" label="Please input your email">
            <Input type="text" placeholder="Email" autoComplete="on" />
          </FormField>

          <FormField<AuthSignSchemaInput> name="password" label="Please input your password">
            <Input type="password" placeholder="Password" autoComplete="on" />
          </FormField>

          <FormField<AuthSignSchemaInput> name="captcha" label="Please input captcha">
            <Input placeholder="captcha" autoComplete="on" />
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
