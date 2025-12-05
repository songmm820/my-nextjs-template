// 验证码类型
export const CaptchaTypeEnum = {
  IMAGE: 'image',
  EMAIL: 'email'
} as const
export type CaptchaTypeEnum = (typeof CaptchaTypeEnum)[keyof typeof CaptchaTypeEnum]

// 验证码用途
export const CaptchaUseEnum = {
  SIGN_IN: 'signIn',
  SIGN_UP: 'signUp',
  OTHER: 'other'
} as const
export type CaptchaUseEnum = (typeof CaptchaUseEnum)[keyof typeof CaptchaUseEnum]

// 错误码类型
export const ErrorStatusEnum = {
  UN_AUTHORIZED: 1007
} as const
export type ErrorStatusEnum = (typeof ErrorStatusEnum)[keyof typeof ErrorStatusEnum]

// Minio 文件夹类型
export const MinioFolderEnum = {
  AVATAR: 'avatar',
  OTHER: 'other'
} as const
export const MinioFolderList = Object.values(MinioFolderEnum)
export type MinioFolderEnum = (typeof MinioFolderEnum)[keyof typeof MinioFolderEnum]
