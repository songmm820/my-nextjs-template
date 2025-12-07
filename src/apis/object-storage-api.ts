import { axiosInstance } from '~/shared/config/axios-config'
import { createSwrMutation } from '~/shared/config/swr'
import { type ObjectStorageUploadDTO } from '~/types/object-storage'

// 对象存储文件上传
const updateUserConfigApiUrl = '/api/object-storage'
const objectStorageUploadApi = (p: ObjectStorageUploadDTO) => {
  return axiosInstance.post<ObjectStorageUploadDTO, ObjectStorageUploadDTO>(
    updateUserConfigApiUrl,
    p
  )
}
export const useObjectStorageUploadSwrApi = createSwrMutation<
  ObjectStorageUploadDTO,
  ObjectStorageUploadDTO
>(updateUserConfigApiUrl, objectStorageUploadApi)
