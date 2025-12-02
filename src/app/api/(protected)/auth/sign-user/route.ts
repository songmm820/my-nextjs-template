import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { verifyJwtToken } from '~/shared/utils/internal/jwt'
import { getSignUserRedis } from '~/shared/db/auth-redis'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/internal/http-response'
import { type SignInUserInfo } from '~/types/auth-api'

export async function GET(request: NextRequest) {
  try {
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里没有一定有jwt，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    const signUser = await getSignUserRedis(userId!)
    return NextResponse.json(
      HttpResponse.success<{
        user: SignInUserInfo['user']
      }>({
        user: signUser.user
      })
    )
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
