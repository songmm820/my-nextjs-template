import { NextResponse } from 'next/server'
import { generateJwtToken, HttpResponse } from '~/shared/utils/server'
import { authRegisterSchema } from '~/shared/zod-schemas/auth.schema'
import type { NextRequest } from 'next/server'
import { CaptchaTypeEnum, CaptchaUseEnum } from '~/shared/enums/comm'
import { hashPassword } from '~/shared/utils/internal/password'
import { getCaptchaRedis, verifyCaptcha } from '~/shared/db/captcha-redis'
import { setSignUserRedis } from '~/shared/db/auth-redis'
import { dbCreateUser, dbUserExistByEmail } from '~/shared/db/user'
import { type SignInUserInfoVO } from '~/types/user-api'

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
    // 签发JWT，注册免登录
    const jwtToken = await generateJwtToken({
      userId: newDbUser.id,
      email: newDbUser.email
    })
    const signUser: Pick<SignInUserInfoVO, 'user' | 'token'> = {
      token: jwtToken,
      user: {
        id: newDbUser.id,
        email: newDbUser.email,
        name: newDbUser.name,
        avatar: newDbUser.avatar
      }
    }
    // 保存用户信息
    await setSignUserRedis(signUser)
    return NextResponse.json(HttpResponse.success<Pick<SignInUserInfoVO, 'user' | 'token'>>(signUser))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign in failed:${String(error)}`))
  }
}
