/**
 * The file is used to write Proxy and run code on the server before a request is completed. Then, based on the
 * incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers or responding directly.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
import type { Route } from 'next'
import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_AUTHORIZATION, type NavRouteHrefType } from '~/shared/constants'
import { removeCookieSafe, verifyJwtToken } from '~/shared/utils/server'
import { redisExistsSignUser } from './shared/db'

// 公开路由
const PUBLIC_ROUTES: Array<NavRouteHrefType> = ['/sign-in', '/sign-up', '/about']
// 公开api
const PUBLIC_API_PATHS: Array<NavRouteHrefType> = [
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/captcha',
  '/api/file'
]

// 重定向
async function redirect(request: NextRequest, url: string) {
  const redirectUrl = new URL(url, request.url)
  return NextResponse.redirect(redirectUrl)
}

// 重定向到登录页
export async function redirectSignIn(request: NextRequest) {
  await removeCookieSafe(COOKIE_AUTHORIZATION)
  const redirectUrl = new URL('/sign-in', request.url)
  redirectUrl.searchParams.set('redirect', encodeURI(request.nextUrl.pathname))
  return NextResponse.redirect(redirectUrl)
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  // 如果访问 /,则重定向到首页
  if (path === '/') {
    return redirect(request, '/home')
  }
  // 公开路由和api
  if (PUBLIC_API_PATHS.includes(path as Route) || PUBLIC_ROUTES.includes(path as Route)) {
    return NextResponse.next()
  }
  // 获取客户端携带的 jwt 令牌
  const questJwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
  if (!questJwtToken) {
    return await redirectSignIn(request)
  }
  // 验证 jwt 令牌
  const payload = await verifyJwtToken(questJwtToken)
  if (!payload) {
    return await redirectSignIn(request)
  }
  // 查询 登录状态
  const signUser = await redisExistsSignUser(payload.userId)
  if (!signUser) {
    return await redirectSignIn(request)
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
