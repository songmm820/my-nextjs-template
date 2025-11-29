'use client'

import Link from 'next/link'
import { useNavigationBlocker } from '~/context/NavigationBlockerProvider'

interface CustomLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode
}

export function CustomLink({ children, ...props }: CustomLinkProps) {
  const { isBlocked } = useNavigationBlocker()

  /**
   * 导航拦截
   *
   * @param e 导航事件
   */
  function handleNavigate(e: { preventDefault: () => void }) {
    if (isBlocked && !window.confirm('离开页面会丢失当前编辑内容，确定要离开吗？')) {
      e.preventDefault()
    }
  }

  return (
    <Link
      className="text-primary hover:brightness-90 transition-all duration-300 mx-2"
      onNavigate={handleNavigate}
      {...props}
    >
      {children}
    </Link>
  )
}
