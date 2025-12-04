import { twMerge } from 'tailwind-merge'

export type IconProps = {
  className?: string
  name?: string
  size?: number
  color?: string
  onClick?: () => void
}

export default function Icon(props: IconProps) {
  const { className, name, size = 16, color = '#000000', onClick } = props

  const handleClick = () => {
    onClick?.()
  }

  return (
    <>
      <svg
        className={twMerge(className)}
        aria-hidden={true}
        width={size}
        height={size}
        color={color}
        onClick={() => handleClick()}
      >
        <use xlinkHref={`#${name}`} />
      </svg>
    </>
  )
}
