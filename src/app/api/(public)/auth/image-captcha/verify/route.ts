import { NextResponse, type NextRequest } from 'next/server'
import { CaptchaType, CaptchaUse } from '~/generated/prisma/enums'
import { generateCaptchaCode, HttpResponse } from '~/shared/utils'
import { sendEmail } from '~/shared/utils/internal/email'
import { prisma } from '~prisma/prisma'

const EXPIRE_TIME = 5 * 60 * 1000 // 5分钟

export async function POST(request: NextRequest) {
  try {
    const { email, imageCaptcha } = await request.json()
    if (!email) {
      return NextResponse.json(
        HttpResponse.error('The email is required, please enter your email address')
      )
    }
    // 根据 email 查询验证码
    const captcha = await prisma.captcha.findFirst({
      where: {
        link: email,
        type: CaptchaType.IMAGE,
        expiresAt: {
          gt: new Date()
        }
      }
    })
    // 验证验证码是否过期或者不存在
    if (!captcha) {
      return NextResponse.json(HttpResponse.error('The captcha is invalid or has expired'))
    }
    // 验证验证码是否正确
    if (captcha.code !== imageCaptcha) {
      return NextResponse.json(HttpResponse.error('The captcha is incorrect'))
    }
    // // 生成邮件验证码
    const emailCaptchaCode = await generateCaptchaCode(6)
    // 发送邮件验证码
    await sendEmail({
      to: email,
      subject: '验证码',
      text: `您的验证码是：${emailCaptchaCode}`
    })
    // 保存邮件验证码
    await prisma.captcha.create({
      data: {
        code: emailCaptchaCode,
        link: email,
        type: CaptchaType.EMAIL,
        use: CaptchaUse.SIGN_IN,
        expiresAt: new Date(Date.now() + EXPIRE_TIME)
      }
    })
    return NextResponse.json(HttpResponse.success('The captcha is verified successfully'))
  } catch (e) {
    return NextResponse.json(HttpResponse.error(`Failed to get captcha：${String(e)}`))
  }
}
