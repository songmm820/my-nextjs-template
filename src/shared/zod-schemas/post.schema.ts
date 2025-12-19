import { z } from 'zod'
import { DynamicPermissionEnum, PostStatusEnum } from '~/generated/prisma/enums'

export const postCreateInput = z.strictObject({
  title: z
    .string('The title is required')
    .min(1, 'The title is too short')
    .max(20, 'The title is too long')
    .trim(),
  summary: z.string('The summary is required').max(200, 'The summary is too long').trim(),
  content: z.string('The content is required').min(1, 'The content is required').trim(),
  coverImage: z.string().trim().optional(),
  tag: z.string().trim(),
  visibility: z.enum(DynamicPermissionEnum, 'The visibility is required'),
  status: z.enum(PostStatusEnum, 'The status is required').optional(),
  isPinned: z.boolean('The isPinned is required')
})
export type PostCreateInputType = z.infer<typeof postCreateInput>
