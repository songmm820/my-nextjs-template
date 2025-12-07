import { z } from 'zod'
import { DynamicPermissionEnum } from '~/generated/prisma/enums'

// 修改用户信息
export const userProfileInfoUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, 'This name is required.')
      .max(20, 'The name should be at most 20 characters.')
      .optional(),
    avatar: z.url('This avatar url is invalid.').optional()
  })
  .strict()
export type UserProfileInfoUpdateSchemaInput = z.infer<typeof userProfileInfoUpdateSchema>

// 修改用户配置
export const userConfigUpdateSchema = z.object({
  themeColor: z.string().optional(),
  profileVisibility: z
    .enum(DynamicPermissionEnum, 'Please select a valid visibility level for profile visibility.')
    .optional(),
  whoCanComment: z
    .enum(DynamicPermissionEnum, 'Please select a valid permission level for who can comment.')
    .optional(),
  whoCanMessage: z
    .enum(DynamicPermissionEnum, 'Please select a valid permission level for who can message.')
    .optional(),
  onlineStatusVisibleFlag: z.boolean().optional()
})
export type UserConfigUpdateSchemaInput = z.infer<typeof userConfigUpdateSchema>
