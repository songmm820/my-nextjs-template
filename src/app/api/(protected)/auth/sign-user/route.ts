import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/server'
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
import {
  userUpdateConfigInput,
  type UserUpdateConfigInputType
} from '~/shared/zod-schemas/user.schema'
import { type CurrentUserOutputType } from '~/types/user-api'
import { getAuthUserId } from '~/shared/lib/auth'

type RouteApiResponse = CurrentUserOutputType & {}

// 查询当前登录用户信息
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)
    // 先获取Redis缓存中的信息和配置
    const [cacheSignInfo, cacheUserConfig, dbExp, dbIsCheckInToday] = await Promise.all([
      redisGetSignUser(userId),
      redisGetUserConfig(userId),
      dbQueryUserExpById(userId),
      dbUserIsCheckInToday(userId)
    ])
    // 计算经验值
    const expInfo = calculateLevelExp(dbExp?.experience ?? 0)
    if (cacheSignInfo && cacheUserConfig) {
      return NextResponse.json(
        HttpResponse.success<RouteApiResponse>({
          user: cacheSignInfo.user,
          config: cacheUserConfig,
          growthValue: expInfo,
          isTodaySigned: dbIsCheckInToday
        })
      )
    }
    // 缓存中没有，从数据库中获取
    const [dbSignUser, dbUserConfig] = await Promise.all([
      dbQueryUserById(userId),
      dbQueryUserConfigById(userId)
    ])
    // 更新缓存(不阻塞)
    redisSetUserConfig(userId, dbUserConfig).then()
    return NextResponse.json(
      HttpResponse.success<RouteApiResponse>({
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
    const params = (await request.json()) as UserUpdateConfigInputType
    const vr = userUpdateConfigInput.safeParse(params)
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    const { themeColor, profileVisibility, whoCanComment, whoCanMessage, onlineStatusVisibleFlag } =
      vr.data
    const userId = await getAuthUserId(request)
    const dbNewConfig = await dbUpdateUserConfigById(userId, {
      themeColor,
      profileVisibility,
      whoCanComment,
      whoCanMessage,
      onlineStatusVisibleFlag
    })
    // 更新缓存(不阻塞)
    redisSetUserConfig(userId, dbNewConfig).then()
    return NextResponse.json(HttpResponse.success(dbNewConfig))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
