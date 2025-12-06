'use client'

import { useEffect } from 'react'
import Header from '~/shared/components/Header'
import Footer from '~/shared/components/Footer'
import type { NavRouteHrefType } from '~/shared/constants'
import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'

const ConfigLayout = ({ children }: { children: React.ReactNode }) => {
  // 不显示 Header 的 routes
  const hideHeaderRoutes: Array<NavRouteHrefType> = ['/sign-in', '/sign-up']
  // 不显示 Footer 的 routes
  const hideFooterRoutes: Array<NavRouteHrefType> = ['/sign-in', '/sign-up']
  const pathname = usePathname()

  // 屏蔽全局右键
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    const block = (e: MouseEvent) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu', block, { capture: true })
    return () => document.removeEventListener('contextmenu', block, { capture: true })
  }, [])

  return (
    <div className="w-full h-full hidden md:flex flex-col">
      <Toaster position="top-center" />
      {!hideHeaderRoutes.includes(pathname as NavRouteHrefType) && (
        <>
          <div className="h-16 shrink-0" />
          <div className="fixed top-0 left-0 w-full z-99">
            <Header />
          </div>
        </>
      )}

      <main className='flex-1 overflow-auto'>{children}</main>

      {!hideFooterRoutes.includes(pathname as NavRouteHrefType) && false && <Footer />}
    </div>
  )
}

export default ConfigLayout
