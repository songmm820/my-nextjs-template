import { z } from 'zod'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'

// 获取验证码
export const captchaGetInput = z.strictObject({
  email: z.email('请输入邮箱').nonempty({
    message: '邮箱不能为空'
  }),
  type: z.enum(CaptchaTypeEnum, '请输入有效的验证码类型'),
  use: z.enum(CaptchaUseEnum, '请输入有效的验证码用途')
})
export type CaptchaGetInputType = z.infer<typeof captchaGetInput>
