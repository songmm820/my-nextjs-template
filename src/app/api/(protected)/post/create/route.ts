import { NextResponse } from 'next/server'
import { dbCreatePost } from '~/shared/db/post-db'
import { getAuthUserId } from '~/shared/lib/auth'
import { createApiHandler } from '~/shared/lib/route-handler'
import { HttpResponse } from '~/shared/utils/server'
import { postCreateInput, type PostCreateInputType } from '~/shared/zod-schemas/post.schema'

// 创建文章信息
export const POST = createApiHandler(async (request) => {
  const params = (await request.json()) as PostCreateInputType
  postCreateInput.parse(params)
  const userId = await getAuthUserId(request)
  // 睡眠5s
  await dbCreatePost(userId, params)
  return NextResponse.json(HttpResponse.success({}))
})
