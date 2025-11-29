// 验证码类型
export const CaptchaTypeEnum = {
  IMAGE: 'image',
  EMAIL: 'email'
} as const
export type CaptchaTypeEnum = (typeof CaptchaTypeEnum)[keyof typeof CaptchaTypeEnum]

// 验证码用途
export const CaptchaUseEnum = {
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  OTHER: 'other'
} as const
export type CaptchaUseEnum = (typeof CaptchaUseEnum)[keyof typeof CaptchaUseEnum]
