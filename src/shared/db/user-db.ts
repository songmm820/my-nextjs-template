import 'server-only'

import { prisma } from '~prisma/prisma'
import { DynamicPermissionEnum, type Prisma } from '~/generated/prisma/client'
import { type UserConfigVO, type UserProfileInfoVO } from '~/types/user-api'
import {
  type UserConfigUpdateDTOSchema,
  type UserProfileInfoUpdateDTOSchema
} from '~/shared/zod-schemas/user.schema'

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
export async function dbQueryUserById(id: string): Promise<UserProfileInfoVO> {
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
        profileVisibility: DynamicPermissionEnum.ALL,
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
 * 根据id修改用户个人信息
 *
 * @param id 用户id
 */
export async function dbUpdateUserProfileInfoById(
  id: string,
  prifile: UserProfileInfoUpdateDTOSchema
): Promise<UserProfileInfoVO> {
  return await prisma.systemUser.update({
    where: {
      id: id
    },
    data: prifile,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true
    }
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

/**
 * 根据用户ID更新用户的配置信息
 *
 * @param id 用户ID
 * @param config 用户配置信息
 */
export async function dbUpdateUserConfigById(
  id: string,
  config: UserConfigUpdateDTOSchema
): Promise<UserConfigVO> {
  const newConfig = await prisma.systemUserConfig.update({
    where: {
      userId: id
    },
    select: {
      themeColor: true,
      profileVisibility: true,
      onlineStatusVisibleFlag: true,
      whoCanComment: true,
      whoCanMessage: true
    },
    data: config
  })
  return newConfig
}

/**
 * 根据用户ID查询用户总经验值
 *
 * @param id 用户id
 */
export async function dbQueryUserExpById(id: string) {
  return await prisma.systemUserLevel.findUnique({
    where: {
      userId: id
    },
    select: {
      experience: true
    }
  })
}

/**
 * 用户签到修改经验值
 *
 * @param id 用户id
 * @param increment 经验值增量
 */
export async function dbUpdateUserLavelExperienceById(id: string, increment: number) {
  return await prisma.systemUserLevel.update({
    where: {
      userId: id
    },
    select: {
      experience: true
    },
    data: {
      experience: {
        increment: increment
      }
    }
  })
}
