import { redis } from '~/shared/config/redis'
import { type UserConfigVO } from '~/types/user-api'

// 用户配置信息过期时间，单位毫秒 （7天）
const CONFIG_EXPIRE_TIME = 7 * 24 * 60 * 60
// 签到记录过期时间，单位毫秒 （1年）
const CHECK_IN_EXPIRE_TIME = 1 * 365 * 24 * 60 * 60
// 用户配置信息Key
const userConfigRedisKey = (userId: string) => `user:config:${userId}`
// 用户每日签到Key 格式: user:checkIn:{userId}:{yyyyMM}
const userCheckInRedisKey = (userId: string) => {
  const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '')
  return `user:checkIn:${userId}:${yearMonth}`
}
// 签到总数Key 格式: user:checkIn:total:{year-month}
const userCheckInTotalRedisKey = (userId: string, year: number, month: number) => {
  return `user:checkIn:total:${userId}:${year}-${month}`
}

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

/**
 * 判断今日是否可以签到
 *
 * @param userId 用户id
 * @return true: 可以签到 false: 已经签到过了
 */
export async function redisUserCheckInTodayCheck(userId: string): Promise<boolean> {
  const key = userCheckInRedisKey(userId)
  const offset = new Date().getDate() - 1
  const result = await redis.getbit(key, offset)
  return result === 0
}

/**
 * 用户每日签到(原子操作)
 *
 * @param userId 用户id
 * @throws Error 已经签到过了
 * @returns 签到天数
 */
export async function redisUserCheckIn(userId: string): Promise<number> {
  const key = userCheckInRedisKey(userId)
  const today = new Date().getDate()
  const offset = today - 1
  const oldValue = await redis.setbit(key, offset, 1)
  // 如果是0，则说明是第一次签到，如果是1，则说明已经签到过了
  if (oldValue === 1) {
    throw new Error('You have already checked in today.')
  }
  const yeah = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const totalKey = userCheckInTotalRedisKey(userId, yeah, month)
  await redis.expire(totalKey, CHECK_IN_EXPIRE_TIME)
  return await redis.incr(totalKey)
}
