import 'server-only'

import COS, { type COSOptions } from 'cos-nodejs-sdk-v5'
import { randomUUID } from 'node:crypto'
import { type ObjectStorageEnum } from '~/shared/enums/comm'

const REGION = process.env.TENCENT_COS_REGION
const BUCKET = process.env.TENCENT_COS_BUCKET

const mimeToExt: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'application/pdf': 'pdf',
  'application/zip': 'zip'
}

const objectKey = (type: ObjectStorageEnum, ext?: string) =>
  `v1/${type}/${randomUUID()}${ext ? `.${ext}` : ''}`

// 使用永久密钥初始化(不推荐)，建议使用临时密钥
// @see https://cloud.tencent.com/document/product/436/8629
const cosOptions: COSOptions = {
  SecretId: process.env.TENCENT_COS_SECRET_ID,
  SecretKey: process.env.TENCENT_COS_SECRET_KEY
}

const cos = new COS(cosOptions)

/**
 * 创建存储桶
 *
 * @param bucketName 存储桶名称
 */
export const tencentCosCreateBucket = async (bucketName: string) => {
  return await cos.putBucket({
    Bucket: bucketName,
    Region: REGION
  })
}

/**
 * 查询存储桶列表
 */
export const tencentCosGetBucketList = async () => {
  return await cos.getService()
}

/**
 * 上传对象
 * @see https://cloud.tencent.com/document/product/436/8629
 *
 * @param file 文件
 * @param key 对象键
 */
export const tencentCosUploadFile = async (type: ObjectStorageEnum, file: File) => {
  const ext = mimeToExt[file.type] || file.name.split('.').pop()?.toLowerCase() || ''
  const key = objectKey(type, ext)
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        StorageClass: 'STANDARD',
        Body: buffer
      },
      (err, data) => {
        if (err) reject(JSON.stringify(err))
        else resolve(data)
      }
    )
  })
  return tencentCosGetObjectUrl(key)
}

/**
 * 获取对象访问URL
 *
 * @param key 对象键
 */
export const tencentCosGetObjectUrl = (key: string) => {
  return cos.getObjectUrl({
    Bucket: BUCKET,
    Region: REGION,
    Key: key,
    Sign: false // 获取带签名的对象 URL，可选填，如果桶权限为私有读，可能需要带上签名
  })
}

/**
 * 删除对象
 *
 * @param key 对象键
 */
export const tencentCosDeleteObject = async (key: string) => {
  return await cos.deleteObject({
    Bucket: BUCKET,
    Region: REGION,
    Key: key
  })
}

/**
 * 判断对象是否存在
 *
 * @param key 对象键
 */
export const tencentCosObjectExists = async (key: string) => {
  return await cos.headObject({
    Bucket: BUCKET,
    Region: REGION,
    Key: key
  })
}
