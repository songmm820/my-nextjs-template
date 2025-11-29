/**
 * The file is used to write Proxy and run code on the server before a request is completed. Then, based on the
 * incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers or responding directly.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
import type { Route } from 'next'
import { NextResponse, type NextRequest } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { AUTHORIZATION, type NavRouteHrefType } from '~/shared/constants'

// 公开路由
const PUBLIC_ROUTES: Array<NavRouteHrefType> = ['/sign-in']
// 公开api
const PUBLIC_API_PATHS: Array<NavRouteHrefType> = [
  '/api/auth/sign-in',
  '/api/auth/captcha',
  '/api/auth/captcha'
]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  // 公开路由和api
  if (PUBLIC_API_PATHS.includes(path as Route) || PUBLIC_ROUTES.includes(path as Route)) {
    return NextResponse.next()
  }
  // 验证 jwt 令牌
  const jwtToken = request.cookies.get(AUTHORIZATION)?.value
  if (!jwtToken) {
    // 未认证用户重定向到登录页，携带原始路径用于登录后跳转
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(redirectUrl)
  }
  const payload = await verifyJwtToken(jwtToken)

  if (!payload) {
    return NextResponse.json(
      HttpResponse.error('The token is error or expired, please sign in again.'),
      {
        status: 401
      }
    )
  }

  return NextResponse.next()
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
