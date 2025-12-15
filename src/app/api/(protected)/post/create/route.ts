import { type NextRequest, NextResponse } from 'next/server'
import { getAuthUserId } from '~/shared/lib/auth'
import { HttpResponse } from '~/shared/utils/server'
import { postCreateInput, type PostCreateInputType } from '~/shared/zod-schemas/post.schema'

// 创建文章信息
export async function POST(request: NextRequest) {
  try {
    const params = (await request.json()) as PostCreateInputType
    const vr = postCreateInput.safeParse(params)
    if (!vr.success) {
      const [er] = vr.error.issues
      return NextResponse.json(HttpResponse.error(er.message))
    }
    const userId = await getAuthUserId(request)
    // const dbPost = await dbCreatePost(userId, { ...dto })
    return NextResponse.json(HttpResponse.success({}))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
