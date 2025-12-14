import { PostStatusEnum } from '~/generated/prisma/enums'
import { prisma } from '~prisma/prisma'
import { type PostCreateInput } from '~/generated/prisma/models'
import { type Post } from '~/generated/prisma/client'

/**
 * 新增文章
 *
 * @param userId 用户ID
 */
export async function dbCreatePost(userId: string, post: PostCreateInput): Promise<Post> {
  return await prisma.$transaction(async (prisma) => {
    // 创建文章
    const dbCreatePost = await prisma.post.create({
      data: {
        title: post.title,
        summary: post.summary,
        content: post.content,
        coverImage: post.coverImage,
        tag: post.tag,
        visibility: post.visibility,
        status: PostStatusEnum.DRAFT,
        isPinned: post.isPinned,
        publishedAt: new Date(),
        userId: userId
      }
    })
    return dbCreatePost
  })
}
