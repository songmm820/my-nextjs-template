import 'server-only'

import { SignJWT, jwtVerify } from 'jose'

// JWT 密钥 min 32 bytes
const JWT_SECRET: string = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'
// JWT 过期时间 30d
const JWT_EXPIRES_IN: string = '30d'
// JWT 签名算法
const encodedKey = new TextEncoder().encode(JWT_SECRET)

// Token 载荷类型
export type JwtPayload = {
  userId: string
  email: string
}

/**
 * 生成 JWT 令牌
 *
 * @params payload 载荷
 */
export async function generateJwtToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(encodedKey)
}

/**
 * 验证 JWT 令牌
 *
 * @params token 令牌
 */
export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey)
    return payload as JwtPayload
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('verify jwt token error:', error)
    return null
  }
}
