import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { AUTHORIZATION } from '~/shared/constants'
import { generateJwtToken, HttpResponse, setCookieSafe } from '~/shared/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    const hashedPassword = await hash(password, 12)
    // 签发 JWT
    const jwtToken = await generateJwtToken({
      userId: '123',
      email
    })
    // 设置 Cookie
    setCookieSafe(AUTHORIZATION, jwtToken)
    return NextResponse.json(HttpResponse.success(jwtToken))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error(`Sign in failed:${String(error)}`))
  }
}
