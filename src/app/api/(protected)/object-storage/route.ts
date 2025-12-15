import { NextResponse } from 'next/server'
import { HttpApiError, HttpResponse } from '~/shared/utils/server'
import { ObjectStorageList, type ObjectStorageEnum } from '~/shared/enums/comm'
import { tencentCosUploadFile } from '~/shared/config/tencent-cos'
import { type ObjectStorageUploadOutputType } from '~/types/object-storage'
import { createApiHandler } from '~/shared/lib/route-handler'

export const POST = createApiHandler(async (request) => {
  const formData = await request.formData()
  const file = formData.get('object') as File
  const type = formData.get('type') as ObjectStorageEnum
  if (!type) {
    throw new HttpApiError('The file type is required')
  }
  if (!ObjectStorageList.includes(type)) {
    throw new HttpApiError('The file type is erro')
  }
  const url = await tencentCosUploadFile(type, file)
  return NextResponse.json(
    HttpResponse.success<ObjectStorageUploadOutputType>({
      url: url,
      timestamp: Date.now()
    })
  )
})
