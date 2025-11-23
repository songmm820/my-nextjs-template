'use client'

import { createContext, useContext, useLayoutEffect, useState } from 'react'
import { createAuthClient } from 'better-auth/client'

const authClient = createAuthClient()

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
    const getUserInfo = () => {
        authClient.getSession().then((session) => {
            if (session) {
                setSysUserInfo({
                    userName: session.data?.user.name,
                    email: session.data?.user.email,
                    avatar: session.data?.user.image
                })
            }
        })
    }

    // 授权登录
    const onAuthLogin = async () => {
        await authClient.signIn.social({
            provider: 'github'
        })
    }

    // 退出登录
    const onAuthLogout = async () => {
        await authClient.signOut()
        setSysUserInfo({})
    }

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
