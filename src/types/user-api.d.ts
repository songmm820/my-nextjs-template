import { type SystemUser, type SystemUserConfig } from '~/generated/prisma/client'

// 用户信息
export type UserBaseInfoOutputType = Pick<SystemUser, 'id' | 'email' | 'name' | 'avatar'>

// 登录信息
export type UserLoginOutputType = {
  token: string
} & {
  user: UserBaseInfoOutputType
  config: UserConfigOutputType
}

// 用户配置信息
export type UserConfigOutputType = Pick<
  SystemUserConfig,
  'themeColor' | 'profileVisibility' | 'onlineStatusVisibleFlag' | 'whoCanComment' | 'whoCanMessage'
>

// 用户经验信息
export type UserExpOutputType = {
  level: number // 等级
  exp: number // 当前等级经验
  maxExp: number // 当前等级升级所需总经验
}

// 当前用户信息
export type CurrentUserOutputType = {
  user: UserBaseInfoOutputType
  config: UserConfigOutputType // 配置信息
  growthValue: UserExpOutputType // 成长值
  isTodaySigned: boolean // 今天是否已签到
}
