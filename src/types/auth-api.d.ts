// 登录用户信息
export type SignInUserInfo = {
  token: string
} & {
  user: Pick<SystemUser, 'userId' | 'email' | 'name' | 'avatar'>
}
