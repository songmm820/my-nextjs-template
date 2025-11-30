'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, deleteCookie } from 'cookies-next/client'
import { usePathname, useRouter } from 'next/navigation'
import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { useSignOutSwrAPi } from '~/apis/auth-api'

type AuthGuardType = {
  isLogin: boolean
  onSignOut: () => void
}

const AuthGuardProviderContext = createContext<AuthGuardType | null>(null)

export const AuthGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { trigger } = useSignOutSwrAPi()

  const [isLogin, setIsLogin] = useState<boolean>(() => {
    const tokenCookie = getCookie(COOKIE_AUTHORIZATION)
    return !!tokenCookie
  })
  const onSignOut = async () => {
    // remove cookie
    const { error } = await trigger()
    if (error) return
    deleteCookie(COOKIE_AUTHORIZATION)
    setIsLogin(false)
    router.push('/sign-in')
  }

  useEffect(() => {}, [pathname, isLogin, router])

  return (
    <AuthGuardProviderContext.Provider value={{ isLogin: isLogin, onSignOut: onSignOut }}>
      {children}
    </AuthGuardProviderContext.Provider>
  )
}

export const useAuthGuard = () => {
  const context = useContext(AuthGuardProviderContext)
  if (!context) {
    throw new Error('useAuthGuard must be used within an AuthGuardProvider')
  }
  return context
}
