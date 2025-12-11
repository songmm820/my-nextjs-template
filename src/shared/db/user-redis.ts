import { redis } from '~/shared/config/redis'
import { type UserConfigVO } from '~/types/user-api'

// 用户配置信息过期时间，单位毫秒 （7天）
const CONFIG_EXPIRE_TIME = 7 * 24 * 60 * 60
// 用户配置信息Key
const userConfigRedisKey = (userId: string) => `user:config:${userId}`

/**
 * 根据userId设置用户配置信息
 *
 * @param userId 用户id
 */
export async function redisSetUserConfig(userId: string, config: UserConfigVO) {
  const key = userConfigRedisKey(userId)
  return redis.set(key, JSON.stringify(config), 'EX', CONFIG_EXPIRE_TIME)
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
