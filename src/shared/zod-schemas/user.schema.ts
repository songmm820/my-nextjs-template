import { z } from 'zod'
import { DynamicPermissionEnum } from '~/generated/prisma/enums'

// 登录
export const userSignInput = z.strictObject({
  email: z.email('Please enter a valid email address'),
  password: z
    .string('This password is required')
    .min(8, 'Password must be at least 8 characters long'),
  captcha: z.string().length(4, 'Captcha must be 4 characters long')
})
export type UserSignInputType = z.infer<typeof userSignInput>

// 注册
export const userRegisterInput = z
  .strictObject({
    email: z.email('Please enter a valid email address'),
    password: z
      .string('This password is required')
      .min(8, 'Password must be at least 8 characters long'),
    twoPassword: z
      .string('This password is required')
      .min(8, 'Password must be at least 8 characters long'),
    captcha: z.string('This captcha is required').length(4, 'Captcha must be 4 characters long')
  })
  .refine((data) => data.password === data.twoPassword, {
    message: 'Passwords do not match',
    path: ['twoPassword']
  })
export type UserRegisterInputType = z.infer<typeof userRegisterInput>

// 修改用户信息
export const userUpdateInput = z.strictObject({
  name: z
    .string('This name is required')
    .min(1, 'The name should be at least 1 characters')
    .max(20, 'The name should be at most 20 characters')
    .optional(),
  avatar: z.url('This avatar url is invalid').optional()
})
export type UserUpdateInputType = z.infer<typeof userUpdateInput>

// 修改用户配置
export const userUpdateConfigInput = z.strictObject({
  themeColor: z.string().optional(),
  profileVisibility: z
    .enum(DynamicPermissionEnum, 'Please select a valid visibility level for profile visibility')
    .optional(),
  whoCanComment: z
    .enum(DynamicPermissionEnum, 'Please select a valid permission level for who can comment')
    .optional(),
  whoCanMessage: z
    .enum(DynamicPermissionEnum, 'Please select a valid permission level for who can message')
    .optional(),
  onlineStatusVisibleFlag: z.boolean().optional()
})
export type UserUpdateConfigInputType = z.infer<typeof userUpdateConfigInput>

