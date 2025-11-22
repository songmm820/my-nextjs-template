'use client'

import { useEffect } from 'react'
import Header from '~/shared/layout/Header'

const ConfigLayout = ({ children }: { children: React.ReactNode }) => {
    // 屏蔽全局右键
    useEffect(() => {
        const block = (e: MouseEvent) => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', block, { capture: true })
        return () => document.removeEventListener('contextmenu', block, { capture: true })
    }, [])

    return (
        <div className="w-full h-full flex flex-col">
            <div className="fixed top-0 left-0 w-full z-2">
                <Header />
            </div>
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default ConfigLayout
