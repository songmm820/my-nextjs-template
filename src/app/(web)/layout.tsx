'use client'

import { useEffect } from 'react'
import Header from '~/shared/components/Header'
import { SWRConfig } from 'swr'

const ConfigLayout = ({ children }: { children: React.ReactNode }) => {
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
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json())
      }}
    >
      <div className="w-full h-full flex flex-col">
        <div className="fixed top-0 left-0 w-full z-2">
          <Header />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </SWRConfig>
  )
}

export default ConfigLayout
