import Image from 'next/image'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { getCaptchaApi } from '~/apis/auth-api'
import { type CaptchaTypeEnum, type CaptchaUseEnum } from '~/shared/enums/comm'
import { Button } from '~/shared/features'

export type ImageCaptchaProps = {
  width?: number
  height?: number
  link: string
  type: CaptchaTypeEnum
  use: CaptchaUseEnum
}

export type ImageCaptchaRef = {
  onGetImageCaptcha: (link: string) => void
}

const ImageCaptchaRef = forwardRef<ImageCaptchaRef, ImageCaptchaProps>((props, ref) => {
  const { width = 120, height = 40, link, type, use } = props
  const [captchaUrl, setCaptChaUrl] = useState<string | null>(null)

  const onGetImageCaptcha = async () => {
    if (!link) return
    const r = await getCaptchaApi({
      email: link,
      type,
      use
    })
    const blob = await r.blob()
    setCaptChaUrl(URL.createObjectURL(blob))
  }

  useImperativeHandle(ref, () => ({
    onGetImageCaptcha
  }))

  if (!captchaUrl)
    return (
      <Button variant="link" disabled={!link} onClick={onGetImageCaptcha}>
        Get Captcha
      </Button>
    )
  return (
    <Image
      title="Get Again ?"
      className="border border-e7 rounded-md cursor-pointer"
      src={captchaUrl}
      width={width}
      height={height}
      alt="captcha"
      onClick={onGetImageCaptcha}
    />
  )
})

ImageCaptchaRef.displayName = 'ImageCaptcha'

export default ImageCaptchaRef
