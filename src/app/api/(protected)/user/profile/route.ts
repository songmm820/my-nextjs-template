import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { dbUpdateUserProfileInfoById, redisUpdateSignUser } from '~/shared/db'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import {
  userProfileInfoUpdateDTOSchema,
  type UserProfileInfoUpdateDTOSchema
} from '~/shared/zod-schemas/user.schema'

// 更新当前登录用户个人信息
export async function PUT(request: NextRequest) {
  try {
    const params = (await request.json()) as UserProfileInfoUpdateDTOSchema
    const { name, avatar } = params
    const vr = userProfileInfoUpdateDTOSchema.safeParse({
      name,
      avatar
    })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    // 修改配置
    const newProfileInfo = await dbUpdateUserProfileInfoById(userId!, {
      name: name,
      avatar: avatar
    })
    // 更新缓存
    redisUpdateSignUser(userId!, newProfileInfo)
    return NextResponse.json(HttpResponse.success(newProfileInfo))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
