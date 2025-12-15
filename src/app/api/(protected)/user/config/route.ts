import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/server'
import { dbUpdateUserConfigById, redisSetUserConfig } from '~/shared/db'
import { userUpdateConfigInput, type UserUpdateInputType } from '~/shared/zod-schemas/user.schema'
import { getAuthUserId } from '~/shared/lib/auth'

// 更新当前登录用户配置信息
export async function PUT(request: NextRequest) {
  try {
    const params = (await request.json()) as UserUpdateInputType
    const vr = userUpdateConfigInput.safeParse(params)
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    const { themeColor, profileVisibility, whoCanComment, whoCanMessage } = vr.data
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
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
