import 'server-only'

import * as Minio from 'minio'
import { randomUUID } from 'node:crypto'
import { type MinioFolderEnum } from '~/shared/enums/comm'

const BUCKET_NAME = 'my-bucket'

const mimeToExt: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'application/pdf': 'pdf',
  'application/zip': 'zip'
}

const minio = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
})

type UploadResponseType = {
  url: string
  objectName: string
}

const objectKey = (type: MinioFolderEnum, ext?: string) =>
  `v1/${type}/${randomUUID()}${ext ? `.${ext}` : ''}`

/**
 * 判断文件存储桶是否存在
 *
 * @param bName 文件桶名称
 */
export async function bucketExists(bName: string) {
  return minio.bucketExists(bName)
}

/**
 * 将文件桶设为公有读
 *
 * @param bName 文件桶名称
 */
export async function ensurePublicRead(bName: string) {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bName}/*`]
      }
    ]
  }
  await minio.setBucketPolicy(bName, JSON.stringify(policy))
}

/**
 * 创建文件存储桶
 *
 * @param bName 文件桶名称
 */
export async function createBucket(bName: string) {
  await minio.makeBucket(bName, 'us-east-1')
  await ensurePublicRead(bName)
}

/**
 * 移除文件存储桶
 *
 * @param bName 文件桶名称
 */
export async function removeBucket(bName: string) {
  await minio.removeBucket(bName)
}

/**
 * 上传文件
 *
 * @param type 文件类型
 * @param file 文件
 */
export async function uploadFile(type: MinioFolderEnum, file: File): Promise<UploadResponseType> {
  const ext = mimeToExt[file.type] || file.name.split('.').pop()?.toLowerCase() || ''
  const key = objectKey(type, ext)
  const buffer = Buffer.from(await file.arrayBuffer())
  await minio.putObject(BUCKET_NAME, key, buffer, buffer.length, {
    'Content-Type': file.type,
    'Content-Length': buffer.length.toString()
  })
  // 24h 有效下载链接
  const url = await minio.presignedGetObject(BUCKET_NAME, key, 24 * 60 * 60)
  return { url, objectName: key }
}
