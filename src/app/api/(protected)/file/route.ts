import { type NextRequest, NextResponse } from 'next/server'
import { HttpResponse } from '~/shared/utils/internal/http-response'
import { uploadFile } from '~/shared/config/minio'
import { type MinioFolderEnum, MinioFolderList } from '~/shared/enums/comm'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as MinioFolderEnum
    if (!type) {
      return NextResponse.json(HttpResponse.error('The file type is required.'))
    }
    if (!MinioFolderList.includes(type)) {
      return NextResponse.json(HttpResponse.error('The file type is error.'))
    }
    const ur = await uploadFile(type, file)
    return NextResponse.json(HttpResponse.success(ur))
  } catch (error) {
    return NextResponse.json(HttpResponse.error(`Upload file error: ${String(error)}`))
  }
}
