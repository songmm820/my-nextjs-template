'use client'

import { createContext, useContext, useState } from 'react'
import { type UserExpVO, type UserConfigVO, type UserProfileInfoVO } from '~/types/user-api'

type LoginUserContextType = {
  user: UserProfileInfoVO | null
  setUserInfo: (user: UserProfileInfoVO) => void
  config: UserConfigVO | null
  setConfig: (config: UserConfigVO) => void
  growthValue: UserExpVO | null
  setGrowthValue: (growthValue: UserExpVO) => void
  isTodaySigned: boolean,
  setTodaySigned: (isTodaySigned: boolean) => void
}

const LoginUserProviderContext = createContext<LoginUserContextType | null>(null)

export const LoginUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfileInfoVO | null>(null)
  const [config, setConfig] = useState<UserConfigVO | null>(null)
  const [growthValue, setGrowthValue] = useState<UserExpVO | null>(null)
  const [isTodaySigned, setIsTodaySigned] = useState<boolean>(false)


  const setUserInfo = (user: UserProfileInfoVO | null) => {
    if (!user) return
    if (Object.keys(user).length === 0) return
    setUser(user)
  }

  const setConfigInfo = (config: UserConfigVO | null) => {
    if (!config) return
    if (Object.keys(config).length === 0) return
    setConfig(config)
  }

  const setGrowthValueInfo = (growthValue: UserExpVO | null) => {
    if (!growthValue) return
    if (Object.keys(growthValue).length === 0) return
    setGrowthValue(growthValue)
  }

  const setTodaySigned = (isTodaySigned: boolean) => {
    setIsTodaySigned(isTodaySigned)
  }

  return (
    <LoginUserProviderContext.Provider
      value={{
        user,
        setUserInfo,
        config,
        setConfig: setConfigInfo,
        growthValue,
        setGrowthValue: setGrowthValueInfo,
        isTodaySigned,
        setTodaySigned
      }}
    >
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
