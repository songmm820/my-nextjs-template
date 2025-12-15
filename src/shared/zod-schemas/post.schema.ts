import { z } from 'zod'

// 新增文章
export const postCreateInput = z.object({})
export type PostCreateInputType = z.infer<typeof postCreateInput>
