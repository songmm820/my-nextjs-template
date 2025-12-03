import 'server-only'

import { prisma } from '~prisma/prisma'
import { DynamicPermissionEnum, type Prisma, VisibilityLevelEnum } from '~/generated/prisma/client'
import { type UserConfigVO, type UserVO } from '~/types/user-api'

/**
 * 根据邮箱登录
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
 * 根据用户id查询用户
 *
 * @param id 用户id
 */
export async function dbQueryUserById(id: string): Promise<UserVO> {
  const user = await prisma.systemUser.findUnique({
    where: {
      id: id
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true
    }
  })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

/**
 * 创建用户
 *
 * @param user 用户信息(可选字段)
 */
export async function dbCreateUser(user: Prisma.SystemUserCreateInput) {
  // 开启事务
  return await prisma.$transaction(async (prisma) => {
    // 1.创建用户
    const dbUser = await prisma.systemUser.create({
      data: user
    })
    // 2.初始化用户等级信息
    await prisma.systemUserLevel.create({
      data: {
        userId: dbUser.id,
        experience: 0
      }
    })
    // 3.初始化用户配置信息
    await prisma.systemUserConfig.create({
      data: {
        userId: dbUser.id,
        profileVisibility: VisibilityLevelEnum.PUBLIC,
        onlineStatusVisibleFlag: true,
        whoCanComment: DynamicPermissionEnum.ALL,
        whoCanMessage: DynamicPermissionEnum.ALL,
        themeColor: '#07A065'
      }
    })
    return dbUser
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
 * 根据用户ID查询用户的配置信息
 *
 * @param id 用户ID
 */
export async function dbQueryUserConfigById(id: string): Promise<UserConfigVO> {
  const config = await prisma.systemUserConfig.findUnique({
    where: {
      userId: id
    },
    select: {
      themeColor: true,
      profileVisibility: true,
      onlineStatusVisibleFlag: true,
      whoCanComment: true,
      whoCanMessage: true
    }
  })
  if (!config) {
    throw new Error('Query user config failed')
  }
  return config
}
