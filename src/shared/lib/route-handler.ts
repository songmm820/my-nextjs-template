import 'server-only'

import { type NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { HttpApiError, HttpResponse } from '~/shared/utils/server'
import { ErrorCode } from '~/shared/constants'

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
        const errors = error.issues.map((issue) => {
          return {
            field: String(issue.path),
            message: issue.message
          }
        })
        return NextResponse.json(HttpResponse.error(errors, ErrorCode.PARAMS_ERROR))
      }
      // Api 业务异常
      if (error instanceof HttpApiError) {
        return NextResponse.json(HttpResponse.error(error.message))
      }
      // Handle error
      return NextResponse.json(HttpResponse.error(`${String(error)}`))
    }
  }
}
