/* eslint-disable no-console */
import 'server-only'

import Redis from 'ioredis'

// redis 单例
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: parseInt(process.env.REDIS_PORT, 10)
})

redis.on('error', (err) => {
  console.error('Redis 连接错误: ', err)
})

redis.on('connect', () => {
  console.log('Redis 连接成功...')
})
