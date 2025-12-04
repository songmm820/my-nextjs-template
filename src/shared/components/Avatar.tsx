import Image from 'next/image'

type AvatarProps = {
  src?: string | null
  size: number
}

const Avatar = (props: AvatarProps) => {
  const { src, size } = props

  const avatar = src || '/images/default_avatar.png'

  return (
    <Image
      className="rounded-full"
      src={avatar}
      width={size}
      height={size}
      loading="eager"
      alt=""
    />
  )
}

export default Avatar
