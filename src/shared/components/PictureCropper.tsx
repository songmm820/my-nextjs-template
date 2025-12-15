/* eslint-disable @next/next/no-img-element */
'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useCallback, useRef, useState } from 'react'
import { type PercentCrop, type PixelCrop, type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { twMerge } from 'tailwind-merge'
const ReactCropDynamic = dynamic(() => import('react-image-crop'), { ssr: false })

type PictureCropperProps = {
  src: string
  className?: string
  size?: number
  aspectRatio?: number
  onCropComplete?: (blob: Blob) => void
}

const PictureCropper = (props: PictureCropperProps) => {
  const { src, className, size = 400, aspectRatio = 1, onCropComplete } = props
  const [crop, setCrop] = useState<Crop>()
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { offsetWidth, offsetHeight } = e.currentTarget
    const cropSize = Math.min(offsetWidth, offsetHeight) * 0.8
    const x = Math.floor((offsetWidth - cropSize) / 2)
    const y = Math.floor((offsetHeight - cropSize) / 2)
    setCrop({
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x: x,
      y: y
    })
  }, [])

  const handleOnComplete = useCallback(
    (crop: PixelCrop, _percentageCrop: PercentCrop) => {
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
    },
    [onCropComplete]
  )

  return (
    <ReactCropDynamic
      className={clsx(twMerge('w-full'), className)}
      crop={crop}
      locked={false}
      circularCrop={false}
      onChange={(crop) => setCrop(crop)}
      aspect={aspectRatio}
      onComplete={handleOnComplete}
    >
      <img
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
