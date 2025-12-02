import 'server-only'

import { prisma } from '~prisma/prisma'
import { type Prisma } from '~/generated/prisma/client'

/**
 * 根据邮箱查询用户
 *
 * @param email 邮箱
 */
export async function dbQueryUserByEmail(email: string) {
  return await prisma.systemUser.findUnique({
    where: {
      email: email
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      password: true
    }
  })
}

/**
 * 创建用户
 *
 * @param user 用户信息(可选字段)
 */
export async function dbCreateUser(user: Prisma.SystemUserCreateInput) {
  // 开启事务
  const transaction = await prisma.$transaction(async (prisma) => {
    // 1.创建用户
    const dbUser = await prisma.systemUser.create({
      data: user
    })
    // 2.初始化用户等级信息
    await prisma.systemUserLevel.create({
      data: {
        userId: dbUser.id,
        level: 1,
        experience: 0
      }
    })
    // 3.初始化用户配置信息 @TODO
  })
}

/**
 * 根据邮箱判断用户是否存在
 *
 * @param email 邮箱
 */
export async function dbUserExistByEmail(email: string): Promise<boolean> {
  const count = await prisma.systemUser.count({
    where: { email }
  })
  return count > 0
}

/**
 * 根据用户ID删除用户（软删除）
 *
 * @param id 用户ID
 */
export async function dbSoftDeleteUserById(id: string) {
  return await prisma.systemUser.softDelete({
    where: { id: id }
  })
}

/**
 * 根据用户ID查询用户的配置信息
 *
 * @param id 用户ID
 */
export async function dbQueryUserConfigById(id: string) {
  return await prisma.systemUserConfig.findUnique({
    where: {
      userId: id
    }
  })
}
