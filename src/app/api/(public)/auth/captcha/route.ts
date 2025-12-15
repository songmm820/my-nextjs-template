import { NextResponse } from 'next/server'
import { CaptchaTypeEnum } from '~/shared/enums/comm'
import { generateCaptchaCode, generateCaptchaImage, HttpResponse } from '~/shared/utils/server'
import { redisGetCaptcha, redisSetCaptcha } from '~/shared/db'
import { captchaGetInput, type CaptchaGetInputType } from '~/shared/zod-schemas/captcha.schema'
import { createApiHandler } from '~/shared/lib/route-handler'

// 获取验证码
export const POST = createApiHandler(async (request) => {
  const params = (await request.json()) as CaptchaGetInputType
  const vr = captchaGetInput.safeParse(params)
  if (!vr.success) {
    const [er] = vr.error.issues
    return NextResponse.json(HttpResponse.error(er.message))
  }
  const { email, type, use } = vr.data
  // 图形验证码可以一直获取，邮箱验证码要校验是否重复发送
  if (type === CaptchaTypeEnum.EMAIL) {
    const dbCaptcha = await redisGetCaptcha(email, type, use)
    // 先查找是否有未失效的验证码
    if (dbCaptcha) {
      return NextResponse.json(
        HttpResponse.error('The email has been sent, please wait for a while before sending again.')
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
