'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import { getCookie } from 'cookies-next/client'
import { usePathname, useRouter } from 'next/navigation'
import { COOKIE_AUTHORIZATION, type ThemeColorType } from '~/shared/constants'
import { useGetLoginUserSwrAPi, useSignOutSwrAPi } from '~/apis/auth-api'
import { useLoginUser } from '~/context/LoginUserProvider'
import { useTheme } from '~/context/ThemeProvider'
import { deleteCookie } from 'cookies-next'

type AuthGuardType = {
  isLogin: boolean
  onSignOut: () => void
}

const AuthGuardProviderContext = createContext<AuthGuardType | null>(null)

export const AuthGuardProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { setUserInfo, setConfig, setGrowthValue, setTodaySigned } = useLoginUser()
  const { setThemeColor } = useTheme()

  const { trigger: signInTrigger } = useGetLoginUserSwrAPi()
  const { trigger: signOutTrigger } = useSignOutSwrAPi()

  const onSignOut = async () => {
    // remove cookie
    const { error } = await signOutTrigger()
    if (error) return
    deleteCookie(COOKIE_AUTHORIZATION)
    router.push('/sign-in')
  }

  const onGetSignUserInfo = async () => {
    signInTrigger().then(({ data, error }) => {
      if (error) return
      if (!data.user) return
      setThemeColor(data.config.themeColor as ThemeColorType)
      setUserInfo(data.user)
      setConfig(data.config)
      setGrowthValue(data.growthValue)
      setTodaySigned(data.isTodaySigned)
    })
  }

  const isLogin = useMemo(() => {
    const tokenCookie = getCookie(COOKIE_AUTHORIZATION)
    return !!tokenCookie
  }, [pathname])

  useEffect(() => {
    const isLoginStatus = !!getCookie(COOKIE_AUTHORIZATION)
    if (!isLoginStatus) return
    onGetSignUserInfo().then()
  }, [pathname])

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
