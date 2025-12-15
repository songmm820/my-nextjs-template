import { type ObjectStorageUploadInputType } from '~/types/object-storage'

/**
 * 点击选取文件
 *
 * @param accept 文件类型
 */
export function selectFile(accept: string = 'image/*') {
  return new Promise<File>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        resolve(file)
      } else {
        reject(new Error('未选择文件'))
      }
    }
    input.click()
  })
}

/**
 * 创建上传文件请求参数
 *
 * @param input 上传文件请求参数
 * @returns formData
 */
export function createObjectStorageForm(input: ObjectStorageUploadInputType): FormData {
  const fd = new FormData()
  fd.append('object', input.object)
  fd.append('type', input.type)
  return fd as FormData
}
