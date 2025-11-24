import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { generateJwtToken, HttpResponse } from '~/shared/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    const hashedPassword = await hash(password, 12)

    // 签发 JWT
    const jwtToken = generateJwtToken({
      userId: '123',
      email
    })

    return NextResponse.json(HttpResponse.success(jwtToken))
  } catch (error) {
    // Handle error
    return NextResponse.json(HttpResponse.error('Sign in failed.'))
  }
}
