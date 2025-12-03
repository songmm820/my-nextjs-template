import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { dbQueryUserById, dbQueryUserConfigById } from '~/shared/db/user-db'
import { type UserVO, type UserConfigVO } from '~/types/user-api'

export async function GET(request: NextRequest) {
  try {
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里没有一定有jwt，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    const signUser = await dbQueryUserById(userId!)
    // 获取用户配置信息
    const userConfig = await dbQueryUserConfigById(userId!)

    return NextResponse.json(
      HttpResponse.success<{
        user: UserVO | null
        config: UserConfigVO | null
      }>({
        user: signUser,
        config: userConfig
      })
    )
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
