'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { type PercentCrop, type PixelCrop, type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { twMerge } from 'tailwind-merge'
const ReactCropDynamic = dynamic(() => import('react-image-crop'), { ssr: false })

type PictureCropperProps = {
  src: string
  className?: string
  size?: number
  aspectRatio?: number
  cropSize?: number
  onCropComplete?: (blob: Blob) => void
}

const PictureCropper = (props: PictureCropperProps) => {
  const { src, className, size = 400, aspectRatio = 1, cropSize = 120, onCropComplete } = props
  const [crop, setCrop] = useState<Crop>()
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    return () => {}
  }, [])

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setCrop({
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x: (size - cropSize) / 2,
      y: (size - cropSize) / 2
    })
  }

  const handleOnComplete = (crop: PixelCrop, _percentageCrop: PercentCrop) => {
    if (!crop || !crop.width || !crop.height || !imageRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const image = imageRef.current
    const { naturalWidth, naturalHeight, offsetWidth, offsetHeight } = image
    const scaleX = naturalWidth / offsetWidth
    const scaleY = naturalHeight / offsetHeight
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    canvas.toBlob(
      (blob) => {
        if (blob) onCropComplete?.(blob)
      },
      'image/jpeg',
      1
    )
  }

  return (
    <ReactCropDynamic
      className={clsx(twMerge('w-full h-full'), className)}
      crop={crop}
      locked={false}
      circularCrop={false}
      onChange={(_, percentCrop) => setCrop(percentCrop)}
      aspect={aspectRatio}
      onComplete={handleOnComplete}
    >
      <Image
        ref={imageRef}
        className={clsx(twMerge('object-cover w-full h-full'))}
        src={src}
        width={size}
        height={size}
        onLoad={handleImageLoad}
        loading="eager"
        crossOrigin="anonymous"
        alt={''}
      />
    </ReactCropDynamic>
  )
}

export default PictureCropper
