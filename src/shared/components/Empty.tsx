import clsx from 'clsx'
import Image from 'next/image'

type EmptyProps = {
  placeholder?: React.ReactNode
  size?: number
}

const Empty = (props: EmptyProps) => {
  const { placeholder = 'No data available', size = 320 } = props
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        className={clsx('h-auto')}
        style={{
          width: `${size}px`
        }}
        src="/images/empty_data.png"
        width={320}
        height={320}
        loading="eager"
        alt="Empty"
      />
      <p className="text-center text-999 text-base">{placeholder}</p>
    </div>
  )
}

export default Empty
