import { z } from 'zod'

// 修改用户信息
export const userInfoUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: 'This name is required.'
      })
      .max(20, {
        message: 'The name should be at most 20 characters.'
      })
      .optional(),
    avatar: z
      .url({
        message: 'This avatar url is invalid.'
      })
      .optional()
  })
  .strict()
export type UserInfoUpdateSchemaInput = z.infer<typeof userInfoUpdateSchema>
