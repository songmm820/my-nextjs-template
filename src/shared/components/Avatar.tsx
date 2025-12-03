import Image from 'next/image'

type AvatarProps = {
  src?: string | null
  size: number
}

const Avatar = (props: AvatarProps) => {
  const { src, size } = props

  const avatar = src || '/images/default_avatar.png'

  return <Image className="rounded-full" src='/images/default_bg.webp' width={size} height={size} alt="" />
}

export default Avatar
