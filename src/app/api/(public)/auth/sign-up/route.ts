import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/generated/prisma/enums'
import { HASH_NUM } from '~/shared/constants'
import { generateJwtToken, HttpResponse } from '~/shared/utils/server'
import { authRegisterSchema } from '~/shared/zod-schemas/auth.schema'
import { prisma } from '~prisma/prisma'
import { type SignInUserInfo } from '~/types/auth-api'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, captcha } = await request.json()
    const vr = authRegisterSchema.safeParse({ email, password, captcha })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    // 校验验证码
    const dbCaptcha = await prisma.captcha.findFirst({
      where: {
        link: email,
        code: captcha,
        type: CaptchaTypeEnum.image,
        use: CaptchaUseEnum.sign_up,
        expiresAt: {
          gt: new Date()
        }
      }
    })
    // 如果没有查询到验证码
    if (!dbCaptcha) {
      return NextResponse.json(
        HttpResponse.error(
          'The verification code may error or expired. Please try requesting a new one again. '
        )
      )
    }
    // 判断用户是否存在
    const dbUser = await prisma.systemUser.findUnique({
      where: {
        email
      }
    })
    if (dbUser) {
      return NextResponse.json(HttpResponse.error('This email has been registered.'))
    }
    const hashedPassword = await hash(password, HASH_NUM)
    // 创建用户
    const newDbUser = await prisma.systemUser.create({
      data: {
        email: email,
        password: hashedPassword,
        name: `Nick for ${email}` // 默认昵称
      }
    })
    // 签发JWT，注册免登录
    const jwtToken = await generateJwtToken({
      userId: newDbUser.id,
      email: newDbUser.email
    })
    return NextResponse.json(
      HttpResponse.success<SignInUserInfo>({
        token: jwtToken,
        user: {
          userId: newDbUser.id,
          email: newDbUser.email,
          name: newDbUser.name,
          avatar: newDbUser.avatar
        }
      })
    )
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign in failed:${String(error)}`))
  }
}
