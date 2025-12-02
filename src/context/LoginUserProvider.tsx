'use client'

import { createContext, useContext, useState } from 'react'
import { type UserConfigVO, type UserVO } from '~/types/user-api'

type LoginUserContextType = {
  user: UserVO | null
  setUserInfo: (user: UserVO) => void
  config: UserConfigVO | null
  setConfig: (config: UserConfigVO) => void
}

const LoginUserProviderContext = createContext<LoginUserContextType | null>(null)

export const LoginUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserVO | null>(null)
  const [config, setConfig] = useState<UserConfigVO | null>(null)

  const setUserInfo = (user: UserVO | null) => {
    if (!user) return
    if (Object.keys(user).length === 0) return
    setUser(user)
  }

  const setConfigInfo = (config: UserConfigVO | null) => {
    if (!config) return
    if (Object.keys(config).length === 0) return
    setConfig(config)
  }

  return (
    <LoginUserProviderContext.Provider
      value={{
        user,
        setUserInfo,
        config,
        setConfig: setConfigInfo
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
