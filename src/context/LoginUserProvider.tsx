'use client'

import { createContext, useContext, useState } from 'react'
import {
  type UserConfigOutputType,
  type UserExpOutputType,
  type UserBaseInfoOutputType
} from '~/types/user-api'

type LoginUserContextType = {
  user: UserBaseInfoOutputType | null
  setUserInfo: (user: UserBaseInfoOutputType) => void
  config: UserConfigOutputType | null
  setConfig: (config: UserConfigOutputType) => void
  growthValue: UserExpOutputType | null
  setGrowthValue: (growthValue: UserExpOutputType) => void
  isTodaySigned: boolean
  setTodaySigned: (isTodaySigned: boolean) => void
}

const LoginUserProviderContext = createContext<LoginUserContextType | null>(null)

export const LoginUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserBaseInfoOutputType | null>(null)
  const [config, setConfig] = useState<UserConfigOutputType | null>(null)
  const [growthValue, setGrowthValue] = useState<UserExpOutputType | null>(null)
  const [isTodaySigned, setIsTodaySigned] = useState<boolean>(false)

  const setUserInfo = (user: UserBaseInfoOutputType | null) => {
    if (!user) return
    if (Object.keys(user).length === 0) return
    setUser(user)
  }

  const setConfigInfo = (config: UserConfigOutputType | null) => {
    if (!config) return
    if (Object.keys(config).length === 0) return
    setConfig(config)
  }

  const setGrowthValueInfo = (growthValue: UserExpOutputType | null) => {
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
