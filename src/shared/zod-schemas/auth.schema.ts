import { z } from 'zod'

// 登录
export const authSignDTOSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    captcha: z.string().length(4, 'Captcha must be 4 characters long')
  })
  .strict()
export type AuthSignDTOSchema = z.infer<typeof authSignDTOSchema>

// 注册
export const authRegisterDTOSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    twoPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    captcha: z.string().length(4, 'Captcha must be 4 characters long')
  })
  .refine((data) => data.password === data.twoPassword, {
    message: 'Passwords do not match',
    path: ['twoPassword']
  })
  .strict()
export type AuthRegisterDTOSchema = z.infer<typeof authRegisterDTOSchema>
