import { z } from 'zod'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'

// 获取验证码
export const captchaGetSchema = z.object({
  email: z.email('Please enter a valid email address').nonempty({
    message: 'Please enter is required'
  }),
  type: z.enum(CaptchaTypeEnum, 'Please enter a valid captcha type'),
  use: z.enum(CaptchaUseEnum, 'Please enter a valid captcha use')
})
export type CaptchaGetSchemaInput = z.infer<typeof captchaGetSchema>
