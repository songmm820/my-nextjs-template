import Image from 'next/image'
import { useEffect, useState } from 'react'
import ReactCrop, { type PercentCrop, type PixelCrop, type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

type PictureCropperProps = {
  src: string
  size?: number
  aspectRatio?: number
  onCropComplete?: (blob: Blob) => void
}

const PictureCropper = (props: PictureCropperProps) => {
  const { src, size = 400, aspectRatio = 1, onCropComplete } = props
  const [crop, setCrop] = useState<Crop>()

  useEffect(() => {
    return () => {}
  }, [])

  const handleOnComplete = (crop: PixelCrop, _percentageCrop: PercentCrop) => {
    if (!crop || !crop.width || !crop.height) return
    const canvas = document.createElement('canvas')
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const image = document.createElement('img')
    image.src = src
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete?.(blob)
        }
      })
    }
  }

  return (
    <ReactCrop
      crop={crop}
      onChange={(c) => setCrop(c)}
      aspect={aspectRatio}
      onComplete={handleOnComplete}
    >
      <Image
        className="w-auto h-full object-cover"
        src={src}
        width={size}
        height={size}
        loading="eager"
        alt={''}
      />
    </ReactCrop>
  )
}

export default PictureCropper
