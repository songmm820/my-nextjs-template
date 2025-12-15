import { NextResponse } from 'next/server'
import { dbUpdateUserProfileInfoById, redisUpdateSignUser } from '~/shared/db'
import { getAuthUserId } from '~/shared/lib/auth'
import { createApiHandler } from '~/shared/lib/route-handler'
import { HttpResponse } from '~/shared/utils/server'
import { userUpdateInput, type UserUpdateInputType } from '~/shared/zod-schemas/user.schema'

// 更新当前登录用户个人信息
export const PUT = createApiHandler(async (request) => {
  const params = (await request.json()) as UserUpdateInputType
  userUpdateInput.parse(params)
  const { name, avatar } = params
  const userId = await getAuthUserId(request)
  // 修改配置
  const newProfileInfo = await dbUpdateUserProfileInfoById(userId, {
    name: name,
    avatar: avatar
  })
  // 更新缓存
  redisUpdateSignUser(userId, newProfileInfo)
  return NextResponse.json(HttpResponse.success(newProfileInfo))
})
