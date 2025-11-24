/**
 * The file is used to write Proxy and run code on the server before a request is completed. Then, based on the
 * incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers or responding directly.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */

import { NextResponse, type NextRequest } from 'next/server'
import { getCookieSafe, HttpResponse, verifyJwtToken } from '~/shared/utils'

const PUBLIC_API_PATHS = ['/api/auth/sign-in']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (PUBLIC_API_PATHS.includes(path)) {
    return NextResponse.next()
  }

  // 验证 jwt 令牌
  const jwtToken = await getCookieSafe('token')

  if (!jwtToken) {
    return NextResponse.json(HttpResponse.error('Please sign in first before accessing.'), {
      status: 401
    })
  }
  const payload = verifyJwtToken(jwtToken)

  if (!payload) {
    return NextResponse.json(HttpResponse.error('The token is error or expired, please sign in again.'), {
      status: 401
    })
  }

  // return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}
