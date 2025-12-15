import { NextResponse } from 'next/server'
import { getAuthUserId } from '~/shared/lib/auth'
import { createApiHandler } from '~/shared/lib/route-handler'
import { HttpResponse } from '~/shared/utils/server'
import { postCreateInput, type PostCreateInputType } from '~/shared/zod-schemas/post.schema'

// 创建文章信息
export const POST = createApiHandler(async (request) => {
  const params = (await request.json()) as PostCreateInputType
  postCreateInput.parse(params)
  const userId = await getAuthUserId(request)
  // const dbPost = await dbCreatePost(userId, { ...dto })
  return NextResponse.json(HttpResponse.success({}))
})
