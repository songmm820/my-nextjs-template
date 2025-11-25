import { z } from 'zod'

// Sign up
export const AuthSignSchema = z.object({
  email: z.email('Please enter a valid email address').trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long')
})

export type AuthSignSchemaType = z.infer<typeof AuthSignSchema>
