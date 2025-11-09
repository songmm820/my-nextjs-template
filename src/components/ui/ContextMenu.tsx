'use client'

import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

interface ContextMenuProps {
    children: ReactNode
    options?: {
        label: string
        onClick?: () => void
    }[]
}

export default function ContextMenu({ children, options = [] }: ContextMenuProps) {
    const [show, setShow] = useState<boolean>(false)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    const handleContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (show) {
            setShow(false)
            await new Promise((resolve) => requestAnimationFrame(resolve))
        }
        setPos({ x: e.clientX, y: e.clientY })
        setShow(true)
    }

    // 点击空白关闭
    const handleClick = useCallback(() => setShow(false), [])

    useEffect(() => {
        if (!show) return // 只在显示时监听，减少全局污染
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [show, handleClick])

    return (
        <>
            <div onContextMenu={handleContextMenu} className="w-full h-full" style={{ left: pos.x, top: pos.y }}>
                {children}
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div
                        key={`${pos.x}-${pos.y}`}
                        className={`fixed z-50 border 
                        border-[rgba(255,255,255,0.26)] 
                        shadow-[#00000080_0_10px_30px]
                        bg-[#0b0b0bb3] rounded-2xl
                     `}
                        style={{ left: pos.x, top: pos.y }}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ scale: 1, opacity: 1, backdropFilter: 'blur(16px)' }}
                        exit={{ scale: 0.8, opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.15 }}
                    >
                        {options.length > 0 && (
                            <div className="flex flex-col px-2 pt-2 pb-3 min-w-30">
                                {options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="px-1 h-8 cursor-pointer text-sm text-white flex items-center"
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
