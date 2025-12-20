import { NextResponse } from 'next/server'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import {
  comparePassword,
  generateJwtToken,
  HttpApiError,
  HttpResponse
} from '~/shared/utils/server'
import {
  dbQueryUserByEmail,
  dbQueryUserConfigById,
  redisGetCaptcha,
  redisSetSignUser,
  redisVerifyCaptcha,
  redisSetUserConfig
} from '~/shared/db'
import { userSignInput, type UserSignInputType } from '~/shared/zod-schemas/user.schema'
import { type UserLoginOutputType } from '~/types/user-api'
import { createApiHandler } from '~/shared/lib/route-handler'

export const POST = createApiHandler(async (request) => {
  const params = (await request.json()) as UserSignInputType
  userSignInput.parse(params)
  const { email, captcha, password } = params
  // 校验验证码 邮箱 | 验证码 | 用途 | 类型 | 过期时间是否匹配
  const cacheCaptcha = await redisGetCaptcha(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_IN)
  // 如果没有查询到验证码
  if (!cacheCaptcha) {
    throw new HttpApiError('验证码可能已过期，请重新获取')
  }
  // 如果验证码不匹配
  const isV = await redisVerifyCaptcha(
    email,
    CaptchaTypeEnum.IMAGE,
    CaptchaUseEnum.SIGN_IN,
    captcha
  )
  if (!isV) {
    throw new HttpApiError('T验证码错误，请重新输入')
  }
  // 校验用户
  const dbUser = await dbQueryUserByEmail(email)
  if (!dbUser) {
    throw new HttpApiError('该邮箱未注册，请先注册')
  }
  // 校验密码
  const isValid = await comparePassword(password, dbUser.password!)
  if (!isValid) {
    throw new HttpApiError('密码错误，请重新输入')
  }
  // 并行执行
  const [jwtToken, userConfig] = await Promise.all([
    generateJwtToken({
      userId: dbUser.id,
      email: email
    }),
    dbQueryUserConfigById(dbUser.id)
  ])
  const signUser: UserLoginOutputType = {
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
  return NextResponse.json(HttpResponse.success<UserLoginOutputType>(signUser))
})
