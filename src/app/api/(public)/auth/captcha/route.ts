import { NextResponse, type NextRequest } from 'next/server'
import { generateCaptchaCode, generateCaptchaImage, HttpResponse } from '~/shared/utils/server'
import { captchaGetSchema } from '~/shared/zod-schemas/captcha.schema'
import { CaptchaTypeEnum } from '~/shared/enums/comm'
import { getCaptchaRedis, setCaptchaRedis } from '~/shared/db/captcha-redis'

export async function POST(request: NextRequest) {
  try {
    const { email, type, use } = await request.json()
    const vr = captchaGetSchema.safeParse({ email, type, use })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    // 图形验证码可以一直获取，邮箱验证码要校验是否重复发送
    if (type === CaptchaTypeEnum.EMAIL) {
      const dbCaptcha = await getCaptchaRedis(email, type, use)
      // 先查找是否有未失效的验证码
      if (dbCaptcha) {
        return NextResponse.json(
          HttpResponse.error(
            'The email has been sent, please wait for a while before sending again.'
          )
        )
      }
    }
    // 生成验证码
    const captchaCode = await generateCaptchaCode(4)
    const captchaImage = await generateCaptchaImage(captchaCode)
    await setCaptchaRedis(email, type, use, captchaCode)
    return new Response(captchaImage, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0'
      }
    })
  } catch (e) {
    return NextResponse.json(HttpResponse.error(`Failed to get captcha：${String(e)}`))
  }
}
