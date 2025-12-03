import { type SystemUser, type SystemUserConfig } from '~/generated/prisma/client'

// 用户信息
export type UserVO = Pick<SystemUser, 'id' | 'email' | 'name' | 'avatar'>

// 登录信息
export type LoginVO = {
  token: string
} & {
  user: UserVO
  config: UserConfigVO
}

// 用户配置信息
export type UserConfigVO = Pick<
  SystemUserConfig,
  'themeColor' | 'profileVisibility' | 'onlineStatusVisibleFlag' | 'whoCanComment' | 'whoCanMessage'
>
