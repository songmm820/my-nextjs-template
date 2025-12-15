import 'server-only'

import { type NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { HttpResponse } from '~/shared/utils/server'

/**
 * Create a handler for API routes
 *
 * @param handler api handler
 */
export function createApiHandler(handler: (request: NextRequest) => Promise<Response>) {
  return async function (request: NextRequest) {
    try {
      return await handler(request)
    } catch (error) {
      // Zod 参数校验错误
      if (error instanceof ZodError) {
        const errors: Array<{
          [key: string]: string
        }> = error.issues.map((issue) => {
          return {
            [String(issue.path)]: issue.message
          }
        })
        return NextResponse.json(HttpResponse.error(errors))
      }
      // @TODO 自定义业务异常
      // Handle error
      return NextResponse.json(HttpResponse.error(`${String(error)}`))
    }
  }
}
