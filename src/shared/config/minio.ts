import 'server-only'

import * as Minio from 'minio'
import { randomUUID } from 'node:crypto'
import { type ObjectStorageEnum } from '~/shared/enums/comm'

/**
 * 设置桶权限为公有读
 *
 * 1. 设置桶权限为公有读
 * wget https://dl.min.io/client/mc/release/linux-amd64/mc chmod +x mc mv mc /usr/local/bin/
 * mc alias set local http://127.0.0.1:9000 minio_3Aa7hw minio_S2pcdc
 * mc policy set public local/my-bucket
 * mc anonymous set public local/my-bucket
 */

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME!

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
}

const objectKey = (type: ObjectStorageEnum, ext?: string) =>
  `v1/${type}/${randomUUID()}${ext ? `.${ext}` : ''}`

/**
 * 生成 MinIO 公有读桶的永久链接（核心工具函数）
 *
 * @param objectKey MinIO 对象的唯一 Key
 * @returns 无签名、永久有效的访问链接
 */
export function getMinioPermanentUrl(objectKey: string): string {
  // 1. 处理协议头（HTTP/HTTPS）
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https://' : 'http://'
  // 2. 处理端口（仅非默认端口时拼接：HTTPS默认443，HTTP默认80）
  const port = Number(process.env.MINIO_PORT)
  const bucketName = process.env.MINIO_BUCKET_NAME
  return `${protocol}${process.env.MINIO_ENDPOINT}:${port}/${bucketName}/${objectKey}`
}

/**
 * 判断文件存储桶是否存在
 *
 * @param bName 文件桶名称
 */
export async function bucketExists(bName: string) {
  return minio.bucketExists(bName)
}

/**
 * 创建文件存储桶
 *
 * @param bName 文件桶名称
 */
export async function createBucket(bName: string) {
  await minio.makeBucket(bName, 'us-east-1')
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
export async function uploadFile(type: ObjectStorageEnum, file: File): Promise<UploadResponseType> {
  const ext = mimeToExt[file.type] || file.name.split('.').pop()?.toLowerCase() || ''
  const key = objectKey(type, ext)
  const buffer = Buffer.from(await file.arrayBuffer())
  await minio.putObject(BUCKET_NAME, key, buffer, buffer.length, {
    'Content-Type': file.type,
    'Content-Length': buffer.length.toString()
  })
  // 获取该图片的下载链接
  const url = getMinioPermanentUrl(key)
  return { url }
}
