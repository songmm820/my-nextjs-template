/* eslint-disable no-console */
/**
 * 该文件创建 Prisma 客户端并将其附加到全局对象上，使你的应用中只创建一个客户端实例。
 * 这有助于解决在开发模式下使用 Prisma ORM 配合 Next.js 时可能出现的热重载问题
 */

import 'dotenv/config'
import { Prisma, PrismaClient } from '~/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
})

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error']
})
  .$on('query', (e) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  })
  .$extends({
    query: {
      // 在所有模型中添加软删除
      $allModels: {
        // 查询操作：自动过滤已删除
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        },
        async findUnique({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        },

        // 更新操作：禁止更新已删除记录
        async update({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        },
        async updateMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        }
      }
    },
    model: {
      $allModels: {
        // 添加一个软删除方法
        async softDelete<T>(
          this: T,
          {
            where
          }: {
            where: Prisma.Args<T, 'update'>['where']
          }
        ): Promise<boolean> {
          const context = Prisma.getExtensionContext(this)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = await (context as any).update({
            where: where,
            data: { deletedAt: new Date() }
          })
          return result !== null
        }
      }
    }
  })

export { prisma }
