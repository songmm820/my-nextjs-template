import { NextResponse } from 'next/server'
import { generateJwtToken, HttpResponse } from '~/shared/utils/server'
import { authRegisterSchema } from '~/shared/zod-schemas/auth.schema'
import { prisma } from '~prisma/prisma'
import { type SignInUserInfo } from '~/types/auth-api'
import type { NextRequest } from 'next/server'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { hashPassword } from '~/shared/utils/internal/password'
import { getCaptchaRedis, verifyCaptcha } from '~/apis/captcha-redis'
import { setSignUserRedis } from '~/apis/auth-redis'

export async function POST(request: NextRequest) {
  try {
    const { email, password, captcha } = await request.json()
    const vr = authRegisterSchema.safeParse({ email, password, captcha, twoPassword: password })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    // 查询验证码
    const dbCaptcha = await getCaptchaRedis(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_UP)
    if (!dbCaptcha) {
      return NextResponse.json(
        HttpResponse.error(
          'The captcha may error or expired. Please try requesting a new one again. '
        )
      )
    }
    // 如果验证码不匹配
    const isV = await verifyCaptcha(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_UP, captcha)
    if (!isV) {
      return NextResponse.json(HttpResponse.error('The captcha may error. '))
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
    const hashedPassword = await hashPassword(password)
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
    const signUser: SignInUserInfo = {
      token: jwtToken,
      user: {
        userId: newDbUser.id,
        email: newDbUser.email,
        name: newDbUser.name,
        avatar: newDbUser.avatar
      }
    }
    // 保存用户信息
    await setSignUserRedis(signUser)
    return NextResponse.json(HttpResponse.success<SignInUserInfo>(signUser))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign in failed:${String(error)}`))
  }
}
