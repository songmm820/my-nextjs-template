import 'server-only'

import { redis } from '~/shared/config/redis'
import { type CaptchaTypeEnum, type CaptchaUseEnum } from '~/shared/enums/comm'

const EXPIRE_TIME = 60

const captchaRedisKey = (type: CaptchaTypeEnum, use: CaptchaUseEnum, link: string) => {
  return `captcha:${type}:${use}:${link}`
}

/**
 * redis 获取验证码
 *
 * @param link 关联邮箱
 * @param type 验证码类型
 * @param use 验证码用途
 */
export async function redisGetCaptcha(link: string, type: CaptchaTypeEnum, use: CaptchaUseEnum) {
  const key = captchaRedisKey(type, use, link)
  return redis.get(key)
}

/**
 * redis 设置验证码
 *
 * @param link 关联邮箱
 * @param type 验证码类型
 * @param use 验证码用途
 * @param captcha 验证码
 */
export async function redisSetCaptcha(
  link: string,
  type: CaptchaTypeEnum,
  use: CaptchaUseEnum,
  captcha: string
) {
  const key = captchaRedisKey(type, use, link)
  return redis.set(key, captcha, 'EX', EXPIRE_TIME)
}

/**
 * redis 删除验证码
 *
 * @param link 关联邮箱
 * @param type 验证码类型
 * @param use 验证码用途
 */
export async function redisDelCaptcha(link: string, type: CaptchaTypeEnum, use: CaptchaUseEnum) {
  const key = captchaRedisKey(type, use, link)
  return redis.del(key)
}

/**
 * 校验验证码（忽略大小写，完成删除验证码）
 *
 * @param link 关联邮箱
 * @param type 验证码类型
 * @param use 验证码用途
 * @param captcha 验证码
 */
export async function redisVerifyCaptcha(
  link: string,
  type: CaptchaTypeEnum,
  use: CaptchaUseEnum,
  captcha: string
) {
  const dbCaptcha = await redisGetCaptcha(link, type, use)
  if (!dbCaptcha) {
    return false
  }
  const isV = dbCaptcha.toLowerCase() === captcha.toLowerCase()
  if (isV) {
    await redisDelCaptcha(link, type, use)
  }
  return isV
}
