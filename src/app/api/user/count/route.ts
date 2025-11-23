import { buildHttpResponse } from '~/shared/lib/http-response'
import { prisma } from '~prisma/prisma'


// 查询用户数量
export async function GET(_request: Request) {
    const count = await prisma.sysUser.count()
    // return new Response(JSON.stringify({ count }), { status: 200 })
    // return new Response(JSON.stringify({ count }), { status: 200 })

    const res = buildHttpResponse<number>({
        status_code: 200,
        data: count
    })
    return new Response(JSON.stringify(res), { status: 200 })
}
