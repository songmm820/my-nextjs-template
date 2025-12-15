import { NextResponse, type NextRequest } from 'next/server'
import { dbUpdateUserProfileInfoById, redisUpdateSignUser } from '~/shared/db'
import { getAuthUserId } from '~/shared/lib/auth'
import { HttpResponse } from '~/shared/utils/server'
import { userUpdateInput, type UserUpdateInputType } from '~/shared/zod-schemas/user.schema'

// 更新当前登录用户个人信息
export async function PUT(request: NextRequest) {
  try {
    const params = (await request.json()) as UserUpdateInputType
    const { name, avatar } = params
    const vr = userUpdateInput.safeParse(params)
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }

    const userId = await getAuthUserId(request)
    // 修改配置
    const newProfileInfo = await dbUpdateUserProfileInfoById(userId, {
      name: name,
      avatar: avatar
    })
    // 更新缓存
    redisUpdateSignUser(userId, newProfileInfo)
    return NextResponse.json(HttpResponse.success(newProfileInfo))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
