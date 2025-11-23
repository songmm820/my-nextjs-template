'use client'

import { createContext, useContext, useLayoutEffect, useState } from 'react'

type AuthContextType = {
    userName?: string
    email?: string
    avatar?: string | null
    onAuthLogin: () => Promise<void>
    onAuthLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [sysUserInfo, setSysUserInfo] = useState<{
        userName?: string
        email?: string
        avatar?: string | null
    }>({})

    // 获取用户信息
    const getUserInfo = () => {}

    // 授权登录
    const onAuthLogin = async () => {}

    // 退出登录
    const onAuthLogout = async () => {}

    useLayoutEffect(() => {
        getUserInfo()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                userName: sysUserInfo?.userName,
                email: sysUserInfo?.email,
                avatar: sysUserInfo?.avatar,
                onAuthLogin,
                onAuthLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}
