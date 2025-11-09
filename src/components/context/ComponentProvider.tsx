'use client'

import React, { useCallback, useContext } from 'react'

interface ComponentContext {
    zIndex: number
    setZIndex: (z: number) => void
}

const ComponentContext = React.createContext<ComponentContext | null>(null)

const defaultConfig: ComponentContext = {
    zIndex: 1000,
    setZIndex: () => {},
}

export const ComponentProvider = ({ children }: { children: React.ReactNode }) => {
    const [componentConfig, setComponentConfig] = React.useState<ComponentContext>(defaultConfig)

    const handleSetZ = useCallback((newZ: number) => {
        setComponentConfig((prev) => ({ ...prev, zIndex: newZ }))
    }, [])

    return (
        <ComponentContext.Provider
            value={{
                zIndex: componentConfig.zIndex,
                setZIndex: handleSetZ,
            }}
        >
            {/* 如果没有配置信息阻塞渲染 */}
            {componentConfig && Object.keys(componentConfig).length > 0 && children}
        </ComponentContext.Provider>
    )
}

export const useZIndex = () => {
    const ctx = useContext(ComponentContext)
    if (!ctx) throw new Error('useZIndex must be used within ComponentProvider')
    return ctx.zIndex
}
