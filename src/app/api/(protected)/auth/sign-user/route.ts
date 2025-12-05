import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { type UserVO, type UserConfigVO } from '~/types/user-api'
import { userConfigUpdateSchema } from '~/shared/zod-schemas/user.schema'
import {
  dbQueryUserById,
  dbQueryUserConfigById,
  dbUpdateUserConfigById,
  redisGetSignUser,
  redisGetUserConfig,
  redisSetUserConfig
} from '~/shared/db'

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
    const [cacheSignInfo, cacheUserConfig] = await Promise.all([
      redisGetSignUser(userId!),
      redisGetUserConfig(userId!)
    ])
    if (cacheSignInfo && cacheUserConfig) {
      return NextResponse.json(
        HttpResponse.success<ApiResponse>({
          user: cacheSignInfo.user,
          config: cacheUserConfig
        })
      )
    }
    // 缓存中没有，从数据库中获取
    const [dbSignUser, dbUserConfig] = await Promise.all([
      dbQueryUserById(userId!),
      dbQueryUserConfigById(userId!)
    ])
    // 更新缓存(不阻塞)
    redisSetUserConfig(userId!, dbUserConfig).then()
    return NextResponse.json(
      HttpResponse.success<ApiResponse>({
        user: dbSignUser,
        config: dbUserConfig
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
    // 更新缓存(不阻塞)
    redisSetUserConfig(userId!, newConfig).then()
    return NextResponse.json(HttpResponse.success(newConfig))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
