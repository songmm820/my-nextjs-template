import 'server-only'

import { type UserConfigVO, type LoginVO } from '~/types/user-api'
import { redis } from '~/shared/config/redis'

// 7d
const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000

/**
 * 设置登录用户
 *
 * @param signInfo 登录信息
 */
export async function setSignUserRedis(signInfo: LoginVO) {
  const key = `sign:user:${signInfo.user.id}`
  return redis.set(key, JSON.stringify(signInfo), 'EX', EXPIRE_TIME)
}

/**
 * 获取当前登录用户
 *
 * @param userId 用户id
 */
export async function getSignUserRedis(userId: string): Promise<LoginVO | null> {
  const key = `user:sign:${userId}`
  const signInfo = await redis.get(key)
  if (!signInfo) return null
  return JSON.parse(signInfo) as LoginVO
}

/**
 * 判断某个用户是否登录
 *
 * @param userId 用户id
 */
export async function isSignUserRedis(userId: string) {
  const key = `user:sign:${userId}`
  return redis.exists(key)
}

/**
 * 清除登录状态
 *
 * @param userId 用户id
 */
export async function clearSignUserRedis(userId: string) {
  const key = `user:sign:${userId}`
  return redis.del(key)
}

/**
 * 根据userId设置用户配置信息
 *
 * @param userId 用户id
 */
export async function setUserConfigRedis(userId: string, config: string) {
  const key = `user:config:${userId}`
  return redis.set(key, config, 'EX', EXPIRE_TIME)
}

/**
 * 根据userId获取用户配置信息
 *
 * @param userId 用户id
 */
export async function getUserConfigRedis(userId: string): Promise<UserConfigVO | null> {
  const key = `user:config:${userId}`
  const config = await redis.get(key)
  return config ? (JSON.parse(config) as UserConfigVO) : null
}
