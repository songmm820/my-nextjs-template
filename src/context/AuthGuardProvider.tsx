'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, deleteCookie } from 'cookies-next/client'
import { useRouter } from 'next/navigation'
import { COOKIE_AUTHORIZATION } from '~/shared/constants'
import { useSignOutSwrAPi } from '~/apis/auth-api'
import { useLoginUser } from '~/context/LoginUserProvider'

type AuthGuardType = {
  isLogin: boolean
  onSignOut: () => void
}

const AuthGuardProviderContext = createContext<AuthGuardType | null>(null)

export const AuthGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { getUser } = useLoginUser()
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

  useEffect(() => {
    if (!isLogin) return
    getUser().then()
  }, [getUser, isLogin])

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
