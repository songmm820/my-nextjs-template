'use client'

import { createContext, useContext, useState } from 'react'
import { type SignInUserInfo } from '~/types/auth-api'

type LoginUserType = SignInUserInfo['user'] & {}

type LoginUserContextType = {
  user: LoginUserType | null
  setUser: (user: LoginUserType | null) => void
}

const LoginUserProviderContext = createContext<LoginUserContextType | null>(null)

export const LoginUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginUser, setLoginUser] = useState<LoginUserType | null>(null)

  const setUser = (user: LoginUserType | null) => {
    if (!user) return
    if (Object.keys(user).length === 0) return
    setLoginUser(user)
  }

  return (
    <LoginUserProviderContext.Provider
      value={{
        user: loginUser,
        setUser
      }}
    >
      {/* 用户信息为空 阻断渲染 */}
      {children}
    </LoginUserProviderContext.Provider>
  )
}

export const useLoginUser = () => {
  const context = useContext(LoginUserProviderContext)
  if (!context) {
    throw new Error('useLoginUser must be used within a LoginUserProvider')
  }
  return context
}
