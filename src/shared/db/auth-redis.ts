import 'server-only'

import { type UserProfileInfoVO, type LoginVO } from '~/types/user-api'
import { redis } from '~/shared/config/redis'

// 7d
const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000

// 登录用户信息Key
const userSignRedisKey = (userId: string) => `user:sign:${userId}`

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
 * 修改登录用户个人信息
 *
 * @param userId 用户id
 * @param newInfo 登录信息
 */
export async function redisUpdateSignUser(userId: string, newInfo: UserProfileInfoVO) {
  const key = userSignRedisKey(userId)
  // 先获取当前登录用户信息
  const oldSignInfo = await redisGetSignUser(userId)
  if (!oldSignInfo) return
  // 合并新旧信息
  const oldUser = oldSignInfo.user
  const newSignInfo = { ...oldSignInfo, user: { ...oldUser, ...newInfo } }
  // 更新登录用户信息
  return redis.set(key, JSON.stringify(newSignInfo), 'EX', EXPIRE_TIME)
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
