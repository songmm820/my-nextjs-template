'use client'

import { useMemo } from 'react'
import Image from 'next/image'

type AvatarProps = {
  src: string | null
  size: number
  name: string | null
}

const Avatar = (props: AvatarProps) => {
  const { src, size, name } = props

  const firstChar = useMemo(() => {
    return name?.charAt(0).toUpperCase() || 'N'
  }, [name])

  if (src) {
    return <Image className="rounded-full" src={src} width={size} height={size} alt="" />
  }

  return (
    <div
      className="rounded-full text-white flex items-center justify-center bg-primary"
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {firstChar}
    </div>
  )
}

export default Avatar
