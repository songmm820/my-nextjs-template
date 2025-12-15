import { NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/server'
import { dbUpdateUserConfigById, redisSetUserConfig } from '~/shared/db'
import {
  userUpdateConfigInput,
  type UserUpdateConfigInputType
} from '~/shared/zod-schemas/user.schema'
import { getAuthUserId } from '~/shared/lib/auth'
import { createApiHandler } from '~/shared/lib/route-handler'

// 更新当前登录用户配置信息
export const PUT = createApiHandler(async (request) => {
  const params = (await request.json()) as UserUpdateConfigInputType
  userUpdateConfigInput.parse(params)
  const { themeColor, profileVisibility, whoCanComment, whoCanMessage } = params
  const userId = await getAuthUserId(request)
  const newConfig = await dbUpdateUserConfigById(userId, {
    themeColor,
    profileVisibility,
    whoCanComment,
    whoCanMessage
  })
  // 更新缓存(不阻塞)
  redisSetUserConfig(userId, newConfig).then()
  return NextResponse.json(HttpResponse.success(newConfig))
})
