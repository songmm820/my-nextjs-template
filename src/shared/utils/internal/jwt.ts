import jwt from 'jsonwebtoken'

// JWT 密钥
const JWT_SECRET: string = 'secret'
// JWT 过期时间 30d
const JWT_EXPIRES_IN: number = 30 * 24 * 60 * 60

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
export function generateJwtToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

/**
 * 验证 JWT 令牌
 *
 * @params token 令牌
 */
export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('verify jwt token error:', error)
    return null
  }
}
