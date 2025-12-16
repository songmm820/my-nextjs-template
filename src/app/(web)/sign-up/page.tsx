'use client'

import { useRef, useState } from 'react'
import { Button, Form, FormField, Input } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { useRouter } from 'next/navigation'
import { CustomLink } from '~/shared/components/CustomLink'
import { useSignUpSwrAPi } from '~/apis/auth-api'
import { setCookie } from 'cookies-next/client'
import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import ImageCaptcha from '~/shared/components/ImageCaptcha'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { userRegisterInput, type UserRegisterInputType } from '~/shared/zod-schemas/user.schema'

const SignInPage = () => {
  const router = useRouter()
  const formRef = useRef<FormRef<UserRegisterInputType>>(null)
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
    router.push('/home')
  }

  return (
    <div className="max-full h-full overflow-hidden">
      <div className="mt-26 w-100 mx-auto">
        <Form<UserRegisterInputType>
          ref={formRef}
          schema={userRegisterInput}
          onChangeValues={(values) => {
            setEmailLive(values.email)
          }}
        >
          <FormField<UserRegisterInputType> name="email" label="Email">
            <Input type="text" autoComplete="on" />
          </FormField>

          <FormField<UserRegisterInputType> name="password" label="Password">
            <Input type="password" autoComplete="on" />
          </FormField>

          <FormField<UserRegisterInputType> name="twoPassword" label="Again Password">
            <Input type="password" autoComplete="on" />
          </FormField>

          <FormField<UserRegisterInputType>
            name="captcha"
            label="Captcha"
            customValueRender={(field) => (
              <div className="flex gap-3">
                <Input {...field} className="flex-1" autoComplete="on" />
                <ImageCaptcha
                  link={emailLive}
                  type={CaptchaTypeEnum.IMAGE}
                  use={CaptchaUseEnum.SIGN_UP}
                />
              </div>
            )}
          ></FormField>
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
