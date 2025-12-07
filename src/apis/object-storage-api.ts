import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type ObjectStorageUploadVO } from '~/types/object-storage'

// 对象存储文件上传
const updateUserConfigApiUrl = '/api/object-storage'
const objectStorageUploadApi = (p: FormData) => {
  return axiosInstance.post<FormData, ObjectStorageUploadVO>(updateUserConfigApiUrl, p, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const useObjectStorageUploadSwrApi = createSwrMutation<FormData, ObjectStorageUploadVO>(
  updateUserConfigApiUrl,
  objectStorageUploadApi
)
