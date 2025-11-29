'use client'

import { useRef } from 'react'
import { Button, Form, FormField, Input } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { authRegisterSchema, type AuthRegisterSchemaInput } from '~/shared/zod-schemas/auth.schema'
import { useRouter } from 'next/navigation'
import { CustomLink } from '~/shared/components/CustomLink'
import { useSignUpSwrAPi } from '~/apis/auth'
import { setCookie } from 'cookies-next/client'
import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { useLoginUser } from '~/context/LoginUserProvider'

const SignInPage = () => {
  const router = useRouter()
  const { setUser } = useLoginUser()
  const formRef = useRef<FormRef<AuthRegisterSchemaInput>>(null)
  const { trigger, isMutating } = useSignUpSwrAPi()

  const onSubmit = async () => {
    const isV = await formRef.current?.validate()
    if (!isV) return
    const values = formRef.current?.getFormValues()
    if (!values) return
    const { data, error } = await trigger({
      email: values.email,
      password: values.password,
      captcha: values.captcha
    })
    if (error) {
      return
    }
    setCookie(COOKIE_AUTHORIZATION, data.token)
    setUser(data.user)
    router.push('/')
  }

  return (
    <div className="max-full h-full overflow-hidden">
      <div className="mt-26 w-100 mx-auto">
        <Form<AuthRegisterSchemaInput>
          ref={formRef}
          schema={authRegisterSchema}
          initialValues={{
            email: 'mmsong@yeah.net',
            captcha: '1345',
            password: '12345678'
          }}
        >
          <FormField<AuthRegisterSchemaInput> name="email" label="Please input your email">
            <Input type="text" placeholder="Email" autoComplete="on" />
          </FormField>

          <FormField<AuthRegisterSchemaInput> name="password" label="Please input your password">
            <Input type="password" placeholder="Password" autoComplete="on" />
          </FormField>

          <FormField<AuthRegisterSchemaInput>
            name="twoPassword"
            label="Please input your password again"
          >
            <Input type="password" placeholder="Again Password" autoComplete="on" />
          </FormField>

          <FormField<AuthRegisterSchemaInput> name="captcha" label="Please input captcha">
            <Input placeholder="captcha" autoComplete="on" />
          </FormField>
        </Form>

        <Button loading={isMutating} className="mt-6" variant="primary" block onClick={onSubmit}>
          Sign Up
        </Button>

        <div className="mt-4 flex justify-end">
          <span className="text-666">Already have an account ?</span>
          <CustomLink href="/sign-in">Sign In</CustomLink>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
