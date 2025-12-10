import { NextResponse } from 'next/server'
import { authRegisterDTOSchema } from '~/shared/zod-schemas/auth.schema'
import type { NextRequest } from 'next/server'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { generateJwtToken, hashPassword, HttpResponse } from '~/shared/utils/server'
import { type LoginVO } from '~/types/user-api'
import {
  redisGetCaptcha,
  redisSetSignUser,
  redisVerifyCaptcha,
  dbCreateUser,
  dbQueryUserConfigById,
  dbUserExistByEmail,
  redisSetUserConfig
} from '~/shared/db'

// 注册
export async function POST(request: NextRequest) {
  try {
    const { email, password, captcha } = await request.json()
    const vr = authRegisterDTOSchema.safeParse({ email, password, captcha, twoPassword: password })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    // 查询验证码
    const dbCaptcha = await redisGetCaptcha(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_UP)
    if (!dbCaptcha) {
      return NextResponse.json(
        HttpResponse.error(
          'The captcha may error or expired. Please try requesting a new one again. '
        )
      )
    }
    // 如果验证码不匹配
    const isV = await redisVerifyCaptcha(
      email,
      CaptchaTypeEnum.IMAGE,
      CaptchaUseEnum.SIGN_UP,
      captcha
    )
    if (!isV) {
      return NextResponse.json(HttpResponse.error('The captcha may error. '))
    }
    // 判断用户是否存在
    const isExist = await dbUserExistByEmail(email)
    if (isExist) {
      return NextResponse.json(HttpResponse.error('This email has been registered.'))
    }
    const hashedPassword = await hashPassword(password)
    // 创建用户
    const newDbUser = await dbCreateUser({
      email: email,
      password: hashedPassword,
      name: 'Nick User' // 默认昵称
    })
    const [jwtToken, userConfig] = await Promise.all([
      generateJwtToken({
        userId: newDbUser.id,
        email: newDbUser.email
      }),
      dbQueryUserConfigById(newDbUser.id)
    ])
    const signUser: LoginVO = {
      token: jwtToken,
      user: {
        id: newDbUser.id,
        email: newDbUser.email,
        name: newDbUser.name,
        avatar: newDbUser.avatar
      },
      config: userConfig
    }
    // 保存用户信息
    redisSetSignUser({
      token: jwtToken,
      user: signUser.user
    }).then()
    redisSetUserConfig(newDbUser.id, userConfig).then()
    return NextResponse.json(HttpResponse.success<LoginVO>(signUser))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign in failed:${String(error)}`))
  }
}
