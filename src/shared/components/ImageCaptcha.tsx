import Image from 'next/image'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { getCaptchaApi } from '~/apis/auth-api'
import { type CaptchaTypeEnum, type CaptchaUseEnum } from '~/shared/enums/comm'

export type ImageCaptchaProps = {
  width: number
  height?: number
  type: CaptchaTypeEnum
  use: CaptchaUseEnum
}

export type ImageCaptchaRef = {
  onGetImageCaptcha: (link: string) => void
}

const ImageCaptchaRef = forwardRef<ImageCaptchaRef, ImageCaptchaProps>((props, ref) => {
  const { width = 120, height = 40, type, use } = props
  const [captchaUrl, setCaptChaUrl] = useState<string | null>(null)

  const onGetImageCaptcha = (link: string) => {
    getCaptchaApi({
      email: link,
      type: type,
      use: use
    }).then(({ data, error }) => {
      if (error) return
      if (data) {
        setCaptChaUrl(URL.createObjectURL(data))
      }
    })
  }

  useImperativeHandle(ref, () => ({
    onGetImageCaptcha
  }))

  if (!captchaUrl) return null
  return (
    <Image
      className="border border-e7 rounded-md"
      src={captchaUrl}
      width={width}
      height={height}
      alt="captcha"
    />
  )
})

ImageCaptchaRef.displayName = 'ImageCaptcha'

export default ImageCaptchaRef
