import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authSignDTOSchema } from '~/shared/zod-schemas/auth.schema'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { type LoginVO } from '~/types/user-api'
import { comparePassword, generateJwtToken, HttpResponse } from '~/shared/utils/server'
import {
  dbQueryUserByEmail,
  dbQueryUserConfigById,
  redisGetCaptcha,
  redisSetSignUser,
  redisVerifyCaptcha
} from '~/shared/db'
import { redisSetUserConfig } from '~/shared/db/user-redis'

// 登录
export async function POST(request: NextRequest) {
  try {
    const { email, password, captcha } = await request.json()
    const vr = authSignDTOSchema.safeParse({ email, password, captcha })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    // 校验验证码 邮箱 | 验证码 | 用途 | 类型 | 过期时间是否匹配
    const cacheCaptcha = await redisGetCaptcha(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_IN)
    // 如果没有查询到验证码
    if (!cacheCaptcha) {
      return NextResponse.json(
        HttpResponse.error('The captcha may expired. Please try requesting a new one again. ')
      )
    }
    // 如果验证码不匹配
    const isV = await redisVerifyCaptcha(
      email,
      CaptchaTypeEnum.IMAGE,
      CaptchaUseEnum.SIGN_IN,
      captcha
    )
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
    // 并行执行
    const [jwtToken, userConfig] = await Promise.all([
      generateJwtToken({
        userId: dbUser.id,
        email: email
      }),
      dbQueryUserConfigById(dbUser.id)
    ])
    const signUser: LoginVO = {
      token: jwtToken,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar
      },
      config: userConfig
    }

    // 保存用户信息
    redisSetSignUser({
      token: jwtToken,
      user: signUser.user
    }).then()
    redisSetUserConfig(dbUser.id, userConfig).then()
    return NextResponse.json(HttpResponse.success<LoginVO>(signUser))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign up failed:${String(error)}`))
  }
}
