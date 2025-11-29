'use client'

import { createContext, useState, useContext } from 'react'

interface NavigationBlockerContextType {
  isBlocked: boolean
  setIsBlocked: (isBlocked: boolean) => void
}

/**
 * 当满足某些条件时，例如当表单有未保存的更改时，您可以使用 prop 来阻止导航。
 * 当你需要阻止跨应用程序中多个组件的导航时（例如在编辑表单时阻止从任何链接导航）。
 * React Context 提供了一种干净的方式来共享此阻塞状态
 */
export const NavigationBlockerContext = createContext<NavigationBlockerContextType>({
  isBlocked: false,
  setIsBlocked: () => {}
})

export function NavigationBlockerProvider({ children }: { children: React.ReactNode }) {
  const [isBlocked, setIsBlocked] = useState(false)

  return (
    <NavigationBlockerContext.Provider value={{ isBlocked, setIsBlocked }}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
