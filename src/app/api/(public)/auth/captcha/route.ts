import { CaptchaTypeEnum } from '~/shared/enums/comm'
import { generateCaptchaCode, generateCaptchaImage, HttpApiError } from '~/shared/utils/server'
import { redisGetCaptcha, redisSetCaptcha } from '~/shared/db'
import { captchaGetInput, type CaptchaGetInputType } from '~/shared/zod-schemas/captcha.schema'
import { createApiHandler } from '~/shared/lib/route-handler'

// 获取验证码
export const POST = createApiHandler(async (request) => {
  const params = (await request.json()) as CaptchaGetInputType
  captchaGetInput.parse(params)
  const { email, type, use } = params
  // 图形验证码可以一直获取，邮箱验证码要校验是否重复发送
  if (type === CaptchaTypeEnum.EMAIL) {
    const dbCaptcha = await redisGetCaptcha(email, type, use)
    // 先查找是否有未失效的验证码
    if (dbCaptcha) {
      throw new HttpApiError(
        'The email has been sent, please wait for a while before sending again'
      )
    }
  }
  // 生成验证码
  const captchaCode = await generateCaptchaCode(4)
  const captchaImage = await generateCaptchaImage(captchaCode)
  await redisSetCaptcha(email, type, use, captchaCode)
  return new Response(captchaImage, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    }
  })
})
