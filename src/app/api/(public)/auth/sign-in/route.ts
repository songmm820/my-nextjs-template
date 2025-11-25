import { hash } from 'bcryptjs'
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import { AUTHORIZATION } from '~/shared/constants'
import { generateJwtToken, HttpResponse, setCookieSafe } from '~/shared/utils'
import { AuthSignSchema } from '~/shared/zod-schemas/auth.schema'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const vr = AuthSignSchema.safeParse({ email, password })
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
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
