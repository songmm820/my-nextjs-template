import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { type CurrentUserVO } from '~/types/user-api'
import { userConfigUpdateDTOSchema } from '~/shared/zod-schemas/user.schema'
import {
  dbQueryUserById,
  dbQueryUserConfigById,
  dbQueryUserExpById,
  dbUpdateUserConfigById,
  dbUserIsCheckInToday,
  redisGetSignUser,
  redisGetUserConfig,
  redisSetUserConfig
} from '~/shared/db'
import { calculateLevelExp } from '~/shared/lib/level'

type ApiResponse = CurrentUserVO & {}

// 查询当前登录用户信息
export async function GET(request: NextRequest) {
  try {
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId

    // 先获取Redis缓存中的信息和配置
    const [cacheSignInfo, cacheUserConfig, dbExp, dbIsCheckInToday] = await Promise.all([
      redisGetSignUser(userId!),
      redisGetUserConfig(userId!),
      dbQueryUserExpById(userId!),
      dbUserIsCheckInToday(userId!)
    ])
    // 计算经验值
    const expInfo = calculateLevelExp(dbExp?.experience ?? 0)
    if (cacheSignInfo && cacheUserConfig) {
      return NextResponse.json(
        HttpResponse.success<ApiResponse>({
          user: cacheSignInfo.user,
          config: cacheUserConfig,
          growthValue: expInfo,
          isTodaySigned: dbIsCheckInToday
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
        config: dbUserConfig,
        growthValue: expInfo,
        isTodaySigned: dbIsCheckInToday
      })
    )
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}

// 更新当前登录用户信息
export async function PUT(request: NextRequest) {
  try {
    const { themeColor, profileVisibility, whoCanComment, whoCanMessage, onlineStatusVisibleFlag } =
      await request.json()
    const vr = userConfigUpdateDTOSchema.safeParse({
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
    const dbNewConfig = await dbUpdateUserConfigById(userId!, {
      themeColor,
      profileVisibility,
      whoCanComment,
      whoCanMessage,
      onlineStatusVisibleFlag
    })
    // 更新缓存(不阻塞)
    redisSetUserConfig(userId!, dbNewConfig).then()
    return NextResponse.json(HttpResponse.success(dbNewConfig))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
