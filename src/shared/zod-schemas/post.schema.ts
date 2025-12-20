import { z } from 'zod'
import { DynamicPermissionEnum, PostStatusEnum } from '~/generated/prisma/enums'

export const postCreateInput = z.strictObject({
  title: z
    .string('请输入标题')
    .min(1, '标题至少1个字符')
    .max(20, '标题最多20个字符')
    .trim(),
  summary: z.string('请输入摘要').max(200, '摘要最多200个字符').trim(),
  content: z.string('请输入内容').min(1, '内容至少1个字符').trim(),
  coverImage: z.string().trim().optional(),
  tag: z.string().trim(),
  visibility: z.enum(DynamicPermissionEnum, '请选择一个有效的权限级别'),
  status: z.enum(PostStatusEnum, '请选择一个有效的状态').optional(),
  isPinned: z.boolean('请选择是否置顶')
})
export type PostCreateInputType = z.infer<typeof postCreateInput>
