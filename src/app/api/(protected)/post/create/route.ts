import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse, verifyJwtToken } from '~/shared/utils/server'
import { dbCreatePost } from '~/shared/db/post-db'
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
    const jwtToken = request.cookies.get(COOKIE_AUTHORIZATION)?.value
    // 这里一定有验证过身份了，如果没有，在proxy.ts中已经被处理过了
    const payload = await verifyJwtToken(jwtToken!)
    const userId = payload?.userId
    // const dbPost = await dbCreatePost(userId!, { ...dto })
    return NextResponse.json(HttpResponse.success({}))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`${String(error)}`))
  }
}
