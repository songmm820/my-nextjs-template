import { type ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}
const PageContainer = (props: PageContainerProps) => {
  const { children } = props
  return (
    <div className="w-full h-auto min-h-100 bg-[#f5f5f7]">
      <div className="h-full max-w-300 mx-auto px-6 py-4">{children}</div>
    </div>
  )
}

export default PageContainer
