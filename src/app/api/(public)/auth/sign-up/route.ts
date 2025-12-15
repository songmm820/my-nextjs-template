import { NextResponse } from 'next/server'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { generateJwtToken, hashPassword, HttpApiError, HttpResponse } from '~/shared/utils/server'
import { type UserLoginOutputType } from '~/types/user-api'
import {
  redisGetCaptcha,
  redisSetSignUser,
  redisVerifyCaptcha,
  dbCreateUser,
  dbQueryUserConfigById,
  dbUserExistByEmail,
  redisSetUserConfig
} from '~/shared/db'
import { userSignInput, type UserRegisterInputType } from '~/shared/zod-schemas/user.schema'
import { createApiHandler } from '~/shared/lib/route-handler'

// 注册
export const POST = createApiHandler(async (request) => {
  const params = (await request.json()) as UserRegisterInputType
  userSignInput.parse(params)
  const { email, password, captcha } = params
  // 查询验证码
  const dbCaptcha = await redisGetCaptcha(email, CaptchaTypeEnum.IMAGE, CaptchaUseEnum.SIGN_UP)
  if (!dbCaptcha) {
    throw new HttpApiError(
      'The captcha may error or expired. Please try requesting a new one again'
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
    throw new HttpApiError('The captcha is incorrect. Please try again')
  }
  // 判断用户是否存在
  const isExist = await dbUserExistByEmail(email)
  if (isExist) {
    throw new HttpApiError('This email has been registered.')
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
  const signUser: UserLoginOutputType = {
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
  return NextResponse.json(HttpResponse.success<UserLoginOutputType>(signUser))
})
