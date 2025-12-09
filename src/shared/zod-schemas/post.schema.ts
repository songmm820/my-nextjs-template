import { z } from 'zod'

// 新增文章
export const postCreateDTOSchema = z.object({})
export type PostCreateDTOSchema = z.infer<typeof postCreateDTOSchema>
