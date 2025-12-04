'use client'

import { setCookie } from 'cookies-next/client'
import { createContext, useCallback, useContext, useState } from 'react'
import { COOKIE_THEME_COLOR, primaryColorList, type ThemeColorType } from '~/shared/constants'

type ThemeProviderProps = {
  children: React.ReactNode
  themeColor: ThemeColorType
}

type ThemeProviderState = {
  themeColor?: ThemeColorType
  setThemeColor: (themeColor: ThemeColorType) => void
}

const [defaultPrimaryColor] = primaryColorList

const initialState: ThemeProviderState = {
  themeColor: defaultPrimaryColor,
  setThemeColor: () => {}
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const { themeColor } = props
  const [color, setColor] = useState(themeColor)

  const onSaveColor = useCallback((color: ThemeColorType) => {
    if (!color) return
    setColor(color)
    setCookie(COOKIE_THEME_COLOR, color)
    const root = document.documentElement
    root.style.setProperty('--primary', color)
  }, [])

  const value = {
    themeColor: color,
    setThemeColor: onSaveColor
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
