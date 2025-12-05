import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { userConfigUpdateSchema } from '~/shared/zod-schemas/user.schema'
import { dbUpdateUserConfigById } from '~/shared/db'
import { redisSetUserConfig } from '~/shared/db/user-redis'

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
