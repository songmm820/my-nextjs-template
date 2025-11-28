/* eslint-disable no-console */
/**
 * 该文件创建 Prisma 客户端并将其附加到全局对象上，使你的应用中只创建一个客户端实例。
 * 这有助于解决在开发模式下使用 Prisma ORM 配合 Next.js 时可能出现的热重载问题
 */

import 'dotenv/config'
import { PrismaClient } from '~/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
})
const prisma = new PrismaClient({ adapter, log: ['query', 'info', 'warn', 'error'] })

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

export { prisma }
