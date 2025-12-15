'use client'

import { useRef, useState } from 'react'
import { Button, Form, FormField, Input } from '~/shared/features'
import { type FormRef } from '~/shared/features/internal/Form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignInSwrAPi } from '~/apis/auth-api'
import { setCookie } from 'cookies-next/client'
import {
  COOKIE_AUTHORIZATION,
  type NavRouteHrefType,
  type ThemeColorType
} from '~/shared/constants'
import { CustomLink } from '~/shared/components/CustomLink'
import ImageCaptcha from '~/shared/components/ImageCaptcha'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { useTheme } from '~/context/ThemeProvider'
import { useLoginUser } from '~/context/LoginUserProvider'
import { userSignInput, type UserSignInputType } from '~/shared/zod-schemas/user.schema'

const SignInPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') as NavRouteHrefType
  const { setThemeColor } = useTheme()
  const { setUserInfo, setConfig } = useLoginUser()
  const formRef = useRef<FormRef<UserSignInputType>>(null)
  const { trigger, isMutating } = useSignInSwrAPi()
  const [emailLive, setEmailLive] = useState<string>('')

  const onSubmit = async () => {
    const isV = await formRef.current?.validate()
    if (!isV) return
    const values = formRef.current?.getFormValues()
    if (!values) return
    const { data, error } = await trigger(values)
    if (error) {
      return
    }
    setCookie(COOKIE_AUTHORIZATION, data.token)
    setThemeColor(data.config.themeColor as ThemeColorType)
    setUserInfo(data.user)
    setConfig(data.config)
    router.push(redirect ?? '/')
  }

  return (
    <div className="max-full h-full overflow-hidden">
      <div className="mt-26 w-100 mx-auto">
        <Form<UserSignInputType>
          ref={formRef}
          schema={userSignInput}
          initialValues={{}}
          onChangeValues={(values) => {
            setEmailLive(values.email)
          }}
        >
          <FormField<UserSignInputType> name="email" label="Please input your email">
            <Input type="text" placeholder="Email" autoComplete="on" />
          </FormField>

          <FormField<UserSignInputType> name="password" label="Please input your password">
            <Input type="password" placeholder="Password" autoComplete="on" />
          </FormField>

          <FormField<UserSignInputType> name="captcha" label="Please input captcha">
            <div className="flex gap-3">
              <Input className="flex-1" placeholder="Captcha" autoComplete="on" />
              <ImageCaptcha
                link={emailLive}
                type={CaptchaTypeEnum.IMAGE}
                use={CaptchaUseEnum.SIGN_IN}
              />
            </div>
          </FormField>
        </Form>

        <Button loading={isMutating} className="mt-6" variant="primary" block onClick={onSubmit}>
          Sign In
        </Button>

        <div className="mt-4 flex justify-end">
          <span className="text-666">Dont have an account ?</span>
          <CustomLink href="/sign-up">Sign Up</CustomLink>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
