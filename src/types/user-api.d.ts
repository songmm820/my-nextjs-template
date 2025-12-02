import { type SystemUser, type SystemUserConfig } from '~/generated/prisma/client'

// 登录用户信息
export type SignInUserVO = Pick<SystemUser, 'id' | 'email' | 'name' | 'avatar'>

// 登录信息
export type SignInUserInfoVO = {
  token: string
} & {
  user: SignInUserVO
}

// 用户配置信息
export type UserConfigVO = Pick<
  SystemUserConfig,
  'themeColor' | 'profileVisibility' | 'onlineStatusVisibleFlag' | 'whoCanComment' | 'whoCanMessage'
>
