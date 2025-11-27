import { NextResponse, type NextRequest } from 'next/server'
import { CaptchaType, CaptchaUse } from '~/generated/prisma/enums'
import { generateCaptchaCode, generateCaptchaImage, HttpResponse } from '~/shared/utils'
import { prisma } from '~prisma/prisma'

// 失效时间
const EXPIRE_TIME = 5 * 60 * 1000 // 5分钟

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    // 校验是否邮箱为空
    if (!email) {
      return NextResponse.json(HttpResponse.error('The email is required, please enter the email.'))
    }
    // 先查找是否有未失效的验证码
    const captcha = await prisma.captcha.findFirst({
      where: {
        link: email,
        use: CaptchaUse.GET_EMAIL_CODE,
        expiresAt: {
          gt: new Date()
        }
      }
    })
    if (captcha) {
      return NextResponse.json(
        HttpResponse.error('The email has been sent, please wait for a while before sending again.')
      )
    }
    // 生成验证码
    const captchaCode = await generateCaptchaCode(4)
    const captchaImage = await generateCaptchaImage(captchaCode)
    await prisma.captcha.create({
      data: {
        code: captchaCode,
        use: CaptchaUse.GET_EMAIL_CODE,
        link: email,
        type: CaptchaType.IMAGE,
        expiresAt: new Date(Date.now() + EXPIRE_TIME)
      }
    })
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
