import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { dbQueryUserById, dbQueryUserConfigById, dbUpdateUserConfigById } from '~/shared/db/user-db'
import { type UserVO, type UserConfigVO } from '~/types/user-api'
import { getSignUserRedis, setSignUserRedis } from '~/shared/db/auth-redis'
import { userConfigUpdateSchema } from '~/shared/zod-schemas/user.schema'

type ApiResponse = {
  user: UserVO
  config: UserConfigVO
}

// 查询当前登录用户信息
export async function GET(request: NextRequest) {
  try {
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    // 先获取Redis缓存中的
    const loginVo = await getSignUserRedis(userId!)
    if (loginVo) {
      return NextResponse.json(
        HttpResponse.success<ApiResponse>({
          user: loginVo.user,
          config: loginVo.config
        })
      )
    }
    const [signUser, userConfig] = await Promise.all([
      dbQueryUserById(userId!),
      dbQueryUserConfigById(userId!)
    ])
    return NextResponse.json(
      HttpResponse.success<ApiResponse>({
        user: signUser,
        config: userConfig
      })
    )
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}

// 更新当前登录用户信息
export async function PUT(request: NextRequest) {
  try {
    const { themeColor, profileVisibility, whoCanComment, whoCanMessage } = await request.json()
    const vr = userConfigUpdateSchema.safeParse({
      themeColor,
      profileVisibility,
      whoCanComment,
      whoCanMessage
    })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    const newConfig = await dbUpdateUserConfigById(userId!, {
      themeColor,
      profileVisibility,
      whoCanComment,
      whoCanMessage
    })
    // 更新缓存
    const loginVo = await getSignUserRedis(userId!)
    if (loginVo) {
      const newLoginVo = {
        ...loginVo,
        config: newConfig
      }
      await setSignUserRedis(newLoginVo)
    }
    return NextResponse.json(HttpResponse.success(newConfig))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
