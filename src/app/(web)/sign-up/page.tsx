'use client'

import { useRef, useState } from 'react'
import { Button, Form, FormField, Input } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { authRegisterSchema, type AuthRegisterSchemaInput } from '~/shared/zod-schemas/auth.schema'
import { useRouter } from 'next/navigation'
import { CustomLink } from '~/shared/components/CustomLink'
import { useSignUpSwrAPi } from '~/apis/auth-api'
import { setCookie } from 'cookies-next/client'
import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { useLoginUser } from '~/context/LoginUserProvider'
import ImageCaptcha from '~/shared/components/ImageCaptcha'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'

const SignInPage = () => {
  const router = useRouter()
  const { setUser } = useLoginUser()
  const formRef = useRef<FormRef<AuthRegisterSchemaInput>>(null)
  const { trigger, isMutating } = useSignUpSwrAPi()
  const [emailLive, setEmailLive] = useState<string>('')

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
          onValueChange={(values) => {
            setEmailLive(values.email)
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
            <div className="flex gap-3">
              <Input placeholder="Captcha" autoComplete="on" />
              <ImageCaptcha
                link={emailLive}
                type={CaptchaTypeEnum.IMAGE}
                use={CaptchaUseEnum.SIGN_UP}
              />
            </div>
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
