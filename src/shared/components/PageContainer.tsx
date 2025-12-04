import { type ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
}
const PageContainer = (props: PageContainerProps) => {
  const { children } = props
  return (
    <div className="w-full h-full min-h-100">
      <div className="h-full max-w-300 mx-auto px-6 py-6">{children}</div>
    </div>
  )
}

export default PageContainer
