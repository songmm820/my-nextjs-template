import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/server'
import { ObjectStorageList, type ObjectStorageEnum } from '~/shared/enums/comm'
import { tencentCosUploadFile } from '~/shared/config/tencent-cos'
import { type ObjectStorageUploadOutputType } from '~/types/object-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('object') as File
    const type = formData.get('type') as ObjectStorageEnum
    if (!type) {
      return NextResponse.json(HttpResponse.error('The file type is required.'))
    }
    if (!ObjectStorageList.includes(type)) {
      return NextResponse.json(HttpResponse.error('The file type is error.'))
    }
    const url = await tencentCosUploadFile(type, file)
    return NextResponse.json(
      HttpResponse.success<ObjectStorageUploadOutputType>({
        url: url,
        timestamp: Date.now()
      })
    )
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`Upload file error: ${String(error)}`))
  }
}
