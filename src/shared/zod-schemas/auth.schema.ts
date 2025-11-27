import { z } from 'zod'

// 登录
export const authSignSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
  })
  .strict()


export type AuthSignSchemaInput = z.infer<typeof authSignSchema>
