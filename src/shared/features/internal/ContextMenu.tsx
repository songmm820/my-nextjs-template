'use client'

import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import clsx from 'clsx'

interface ContextMenuProps {
  children: ReactNode
  options?: Array<ReactNode>
}

export default function ContextMenu({ children, options = [] }: ContextMenuProps) {
  const [show, setShow] = useState<boolean>(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
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
            className={clsx('fixed z-50 rounded-2xl glass-bg')}
            style={{ left: pos.x, top: pos.y }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.15 }}
          >
            {options.length > 0 && (
              <div className="flex flex-col px-1 pt-2 pb-3 min-w-36">
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    className={clsx('px-2 h-8 cursor-pointer rounded-md', 'text-sm text-gray-50 flex items-center')}
                    whileHover={{ backgroundColor: '#ffffff1a' }}
                    transition={{ duration: 0.3 }}
                  >
                    {option}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
