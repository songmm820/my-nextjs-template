import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/server'

export async function GET(request: NextRequest) {
  try {
    //
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`Upload file error: ${String(error)}`))
  }
}
