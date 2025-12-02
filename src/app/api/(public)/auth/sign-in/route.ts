import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { generateJwtToken, HttpResponse } from '~/shared/utils/server'
import { authSignSchema } from '~/shared/zod-schemas/auth.schema'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { type SignInUserInfo } from '~/types/auth-api'
import { comparePassword } from '~/shared/utils/internal/password'
import { getCaptchaRedis, verifyCaptcha } from '~/shared/db/captcha-redis'
import { setSignUserRedis } from '~/shared/db/auth-redis'
import { dbQueryUserByEmail } from '~/shared/db/user'

export async function POST(request: NextRequest) {
  try {
    const { email, password, captcha } = await request.json()
    const vr = authSignSchema.safeParse({ email, password, captcha })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    // 校验验证码 邮箱 | 验证码 | 用途 | 类型 | 过期时间是否匹配
    const dbCaptcha = await getCaptchaRedis(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_IN)
    // 如果没有查询到验证码
    if (!dbCaptcha) {
      return NextResponse.json(
        HttpResponse.error('The captcha may expired. Please try requesting a new one again. ')
      )
    }
    // 如果验证码不匹配
    const isV = await verifyCaptcha(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_IN, captcha)
    if (!isV) {
      return NextResponse.json(HttpResponse.error('The captcha may error. '))
    }
    // 校验用户
    const dbUser = await dbQueryUserByEmail(email)
    if (!dbUser) {
      return NextResponse.json(
        HttpResponse.error('The user associated with this email does not exist.')
      )
    }
    // 校验密码
    const isValid = await comparePassword(password, dbUser.password!)
    if (!isValid) {
      return NextResponse.json(HttpResponse.error('The password is incorrect, please try again.'))
    }
    // 签发JWT
    const jwtToken = await generateJwtToken({
      userId: dbUser.id,
      email: email
    })
    const signUser: SignInUserInfo = {
      token: jwtToken,
      user: {
        userId: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar
      }
    }
    // 保存用户信息
    await setSignUserRedis(signUser)
    return NextResponse.json(HttpResponse.success<SignInUserInfo>(signUser))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign up failed:${String(error)}`))
  }
}
