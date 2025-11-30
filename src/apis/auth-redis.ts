import 'server-only'

import { type SignInUserInfo } from '~/types/auth-api'
import { redis } from '~/shared/config/redis'

// 7d
const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000

/**
 * 设置登录用户
 *
 * @param signInfo 登录信息
 */
export async function setSignUserRedis(signInfo: SignInUserInfo) {
  const key = `sign:user:${signInfo.user.userId}`
  return redis.set(key, JSON.stringify(signInfo), 'EX', EXPIRE_TIME)
}

/**
 * 获取当前登录用户
 *
 * @param userId 用户id
 */
export async function getSignUserRedis(userId: string): Promise<SignInUserInfo> {
  const key = `sign:user:${userId}`
  const signInfo = await redis.get(key)
  if (!signInfo) throw new Error('No login user information found.')
  return JSON.parse(signInfo) as SignInUserInfo
}

/**
 * 判断某个用户是否登录
 */
export async function isSignUserRedis(userId: string) {
  const key = `sign:user:${userId}`
  return redis.exists(key)
}

/**
 * 清除登录状态
 *
 * @param userId 用户id
 */
export async function clearSignUserRedis(userId: string) {
  const key = `sign:user:${userId}`
  return redis.del(key)
}
