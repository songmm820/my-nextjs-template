import clsx from 'clsx'
import Image from 'next/image'

type AvatarProps = {
  src?: string | null
  size: number
  isSquare?: boolean
}

const Avatar = (props: AvatarProps) => {
  const { src, size, isSquare = false } = props

  const avatar = src || '/example/v2-example.jpg'

  return (
    <Image
      className={clsx(' object-cover object-center', isSquare ? 'rounded-lg' : 'rounded-full')}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      src={avatar}
      width={size}
      height={size}
      loading="eager"
      alt=""
    />
  )
}

export default Avatar
