'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, deleteCookie } from 'cookies-next/client'
import { useRouter } from 'next/navigation'
import { COOKIE_AUTHORIZATION, type ThemeColorType } from '~/shared/constants'
import { useGetLoginUserSwrAPi, useSignOutSwrAPi } from '~/apis/auth-api'
import { useLoginUser } from '~/context/LoginUserProvider'
import { useTheme } from './ThemeProvider'

type AuthGuardType = {
  isLogin: boolean
  onSignOut: () => void
}

const AuthGuardProviderContext = createContext<AuthGuardType | null>(null)

export const AuthGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const { setUserInfo, setConfig } = useLoginUser()
  const { setThemeColor } = useTheme()

  const { trigger: signInTrigger } = useGetLoginUserSwrAPi()
  const { trigger: signOutTrigger } = useSignOutSwrAPi()

  const [isLogin, setIsLogin] = useState<boolean>(() => {
    const tokenCookie = getCookie(COOKIE_AUTHORIZATION)
    return !!tokenCookie
  })
  const onSignOut = async () => {
    // remove cookie
    const { error } = await signOutTrigger()
    if (error) return
    deleteCookie(COOKIE_AUTHORIZATION)
    setIsLogin(false)
    router.push('/sign-in')
  }

  const onGetSignUserInfo = async () => {
    signInTrigger().then(({ data, error }) => {
      if (error) return
      if (!data.user) return
      setUserInfo(data.user)
      setConfig(data.config)
      setThemeColor(data.config.themeColor as ThemeColorType)
    })
  }

  useEffect(() => {
    if (!isLogin) return
    onGetSignUserInfo().then()
  }, [isLogin])

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
