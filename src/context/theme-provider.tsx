'use client'

import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { primaryColorList } from '~/shared/utils'

type ThemeColorType = (typeof primaryColorList)[number]

type ThemeProviderProps = {
    children: React.ReactNode
    themeColor?: ThemeColorType
    storageKey?: string
}

type ThemeProviderState = {
    themeColor: ThemeColorType
    setThemeColor: (themeColor: ThemeColorType) => void
}

const [defaultPrimaryColor] = primaryColorList

const initialState: ThemeProviderState = {
    themeColor: defaultPrimaryColor,
    setThemeColor: () => {}
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider = ({ children, storageKey = 'vite-ui-theme', ...props }: ThemeProviderProps) => {
    const [themeColor, setThemeColor] = useState<ThemeColorType>(defaultPrimaryColor)

    useLayoutEffect(() => {
        const root = document.documentElement
        root.style.setProperty('--primary', themeColor)
    }, [themeColor])

    const onSetThemeColor = useCallback((color: ThemeColorType) => {
        setThemeColor(color)
    }, [])

    const value = {
        themeColor,
        setThemeColor: onSetThemeColor
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
