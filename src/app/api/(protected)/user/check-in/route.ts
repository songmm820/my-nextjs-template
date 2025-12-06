import { type NextRequest, NextResponse } from 'next/server'
import { CHECK_IN_EXPERIENCE, COOKIE_AUTHORIZATION } from '~/shared/constants'
import { dbUpdateUserLavelExperienceById } from '~/shared/db'
import { redisUserCheckIn } from '~/shared/db/user-redis'
import { calculateLevelExp } from '~/shared/lib/level'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { type UserExpVO } from '~/types/user-api'

// 用户签到
export async function GET(request: NextRequest) {
  try {
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    await redisUserCheckIn(userId!)
    const dbUserExp = await dbUpdateUserLavelExperienceById(userId!, CHECK_IN_EXPERIENCE)
    const useExoVo: UserExpVO = calculateLevelExp(dbUserExp.experience)
    return NextResponse.json(HttpResponse.success<UserExpVO>(useExoVo))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
