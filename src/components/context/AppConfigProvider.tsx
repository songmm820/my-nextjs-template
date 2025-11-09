'use client'

import React, { useEffect } from 'react'

export type AppConfigContext = {
    primaryColor: string
    backgroundColor?: string
    backgroundImage?: string
}

const defaultConfig: AppConfigContext = {
    primaryColor: '#0062ff',
    backgroundColor: '#333',
    backgroundImage: '/images/default_bg.webp',
}

const AppConfigContext = React.createContext<AppConfigContext | null>(null)

/**
 * AppConfigProvider组件：应用配置提供者组件
 * 用于管理全局应用配置状态，例如布局、主题模式等
 */
export const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [appConfig, setAppConfig] = React.useState<AppConfigContext>(defaultConfig)

    useEffect(() => {}, [])

    return (
        <AppConfigContext.Provider value={appConfig}>
            {/* 如果没有配置信息阻塞渲染 */}
            {appConfig && Object.keys(appConfig).length > 0 && children}
        </AppConfigContext.Provider>
    )
}

export const useAppConfig = () => {
    const context = React.useContext(AppConfigContext)
    if (!context) {
        throw new Error('useAppConfig must be used within an AppConfigProvider')
    }
    return context
}
