import 'server-only'

import Redis from 'ioredis'

// redis 单例
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: parseInt(process.env.REDIS_PORT, 10)
})
