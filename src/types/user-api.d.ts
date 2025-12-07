import { type SystemUser, type SystemUserConfig } from '~/generated/prisma/client'

// 用户信息
export type UserProfileInfoVO = Pick<SystemUser, 'id' | 'email' | 'name' | 'avatar'>

// 登录信息
export type LoginVO = {
  token: string
} & {
  user: UserProfileInfoVO
  config: UserConfigVO
}

// 用户配置信息
export type UserConfigVO = Pick<
  SystemUserConfig,
  'themeColor' | 'profileVisibility' | 'onlineStatusVisibleFlag' | 'whoCanComment' | 'whoCanMessage'
>

// 用户经验信息
export type UserExpVO = {
  level: number // 等级
  exp: number // 当前等级经验
  maxExp: number // 当前等级升级所需总经验
}

// 当前用户信息
export type CurrentUserVO = {
  user: UserProfileInfoVO
  config: UserConfigVO // 配置信息
  growthValue: UserExpVO // 成长值
  isTodaySigned: boolean // 今天是否已签到
}
