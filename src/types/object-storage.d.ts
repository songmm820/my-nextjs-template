import { type ObjectStorageEnum } from '~/shared/enums/comm'

// 对象存储上传参数类型
export type ObjectStorageUploadInputType = {
  object: File
  type: ObjectStorageEnum
}

// 对象存储上传返回类型
export type ObjectStorageUploadOutputType = {
  url: string
  timestamp: string | number
}
