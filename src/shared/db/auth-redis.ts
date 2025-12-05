import 'server-only'

import { type UserConfigVO, type LoginVO } from '~/types/user-api'
import { redis } from '~/shared/config/redis'

// 7d
const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000

// 登录用户信息Key
const userSignRedisKey = (userId: string) => `user:sign:${userId}`
// 用户配置信息Key
const userConfigRedisKey = (userId: string) => `user:config:${userId}`

type SignUserVO = Pick<LoginVO, 'token' | 'user'>

/**
 * 设置登录用户个人信息
 *
 * @param signInfo 登录信息
 */
export async function redisSetSignUser(signInfo: SignUserVO) {
  const key = userSignRedisKey(signInfo.user.id)
  return redis.set(key, JSON.stringify(signInfo), 'EX', EXPIRE_TIME)
}

/**
 * 获取当前登录用户
 *
 * @param userId 用户id
 */
export async function redisGetSignUser(userId: string): Promise<SignUserVO | null> {
  const key = userSignRedisKey(userId)
  const signInfo = await redis.get(key)
  if (!signInfo) return null
  return JSON.parse(signInfo) as SignUserVO
}

/**
 * 判断某个用户是否登录
 *
 * @param userId 用户id
 */
export async function redisExistsSignUser(userId: string) {
  const key = userSignRedisKey(userId)
  return redis.exists(key)
}

/**
 * 清除登录状态
 *
 * @param userId 用户id
 */
export async function redisDelSignUser(userId: string) {
  const key = userSignRedisKey(userId)
  return redis.del(key)
}

/**
 * 根据userId设置用户配置信息
 *
 * @param userId 用户id
 */
export async function redisSetUserConfig(userId: string, config: UserConfigVO) {
  const key = userConfigRedisKey(userId)
  return redis.set(key, JSON.stringify(config), 'EX', EXPIRE_TIME)
}

/**
 * 根据userId获取用户配置信息
 *
 * @param userId 用户id
 */
export async function redisGetUserConfig(userId: string): Promise<UserConfigVO | null> {
  const key = userConfigRedisKey(userId)
  const config = await redis.get(key)
  return config ? (JSON.parse(config) as UserConfigVO) : null
}
