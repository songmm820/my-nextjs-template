import { type NextRequest, NextResponse } from 'next/server'
import { CHECK_IN_EXPERIENCE } from '~/shared/constants'
import { dbUserCheckInById, dbUserIsCheckInToday } from '~/shared/db'
import { getAuthUserId } from '~/shared/lib/auth'
import { calculateLevelExp } from '~/shared/lib/level'
import { HttpResponse } from '~/shared/utils/server'
import { type UserExpOutputType } from '~/types/user-api'

// 用户签到
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request)
    const dbIsCheckIn = await dbUserIsCheckInToday(userId)
    if (dbIsCheckIn) {
      return NextResponse.json(HttpResponse.error('You have already checked in today.'))
    }
    const dbUserExp = await dbUserCheckInById(userId, CHECK_IN_EXPERIENCE)
    const useExoVo: UserExpOutputType = calculateLevelExp(dbUserExp.experience)
    return NextResponse.json(HttpResponse.success<UserExpOutputType>(useExoVo))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
