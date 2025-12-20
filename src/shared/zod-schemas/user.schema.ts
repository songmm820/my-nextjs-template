import { z } from 'zod'
import { DynamicPermissionEnum } from '~/generated/prisma/enums'

// 登录
export const userSignInput = z.strictObject({
  email: z.email('请输入邮箱'),
  password: z
    .string('请输入密码')
    .min(8, '密码至少8位字符'),
  captcha: z.string('请输入验证码').length(4, '验证码必须为4位字符')
})
export type UserSignInputType = z.infer<typeof userSignInput>

// 注册
export const userRegisterInput = z
  .strictObject({
    email: z.email('请输入邮箱'),
    password: z
      .string('请输入密码')
      .min(8, '密码至少8位字符'),
    twoPassword: z
      .string('请输入密码')
      .min(8, '密码至少8位字符'),
    captcha: z.string('请输入验证码').length(4, '验证码必须为4位字符')
  })
  .refine((data) => data.password === data.twoPassword, {
    message: '两次输入的密码不一致',
    path: ['twoPassword']
  })
export type UserRegisterInputType = z.infer<typeof userRegisterInput>

// 修改用户信息
export const userUpdateInput = z.strictObject({
  name: z
    .string('请输入用户昵称')
    .min(1, '用户昵称至少1位字符')
    .max(20, '用户昵称最多20位字符')
    .optional(),
  avatar: z.url('请请选择用户头像').optional()
})
export type UserUpdateInputType = z.infer<typeof userUpdateInput>

// 修改用户配置
export const userUpdateConfigInput = z.strictObject({
  themeColor: z.string().optional(),
  profileVisibility: z
    .enum(DynamicPermissionEnum, '请选择一个有效的权限级别')
    .optional(),
  whoCanComment: z
    .enum(DynamicPermissionEnum, '请选择一个有效的权限级别')
    .optional(),
  whoCanMessage: z
    .enum(DynamicPermissionEnum, '请选择一个有效的权限级别')
    .optional(),
  onlineStatusVisibleFlag: z.boolean().optional()
})
export type UserUpdateConfigInputType = z.infer<typeof userUpdateConfigInput>
