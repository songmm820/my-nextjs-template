import clsx from 'clsx'
import { type ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  autoHeight?: boolean
}
const PageContainer = (props: PageContainerProps) => {
  const { autoHeight = true, children } = props
  return (
    <div
      className={clsx(
        'page-contailer w-full bg-[#f5f5f7]',
        autoHeight ? 'min-h-full h-auto' : 'h-full'
      )}
    >
      <div className="h-full max-w-300 mx-auto px-6 py-4">{children}</div>
    </div>
  )
}

export default PageContainer
