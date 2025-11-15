'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useZIndex } from '@/components/context/ComponentProvider'
import clsx from 'clsx'

interface ModalProps {
    children: React.ReactNode
    show?: boolean
    width?: string | number
    height?: string | number
    onClose?: () => void
}

const Modal = ({ children, show = false, width = '600px', height = '600px', onClose }: ModalProps) => {
    const zIndex = useZIndex()

    useEffect(() => {
        if (!show) return
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose?.()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleEsc)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleEsc)
        }
    }, [show, onClose])

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* 遮罩层：只它负责半透明+模糊 */}
                    <motion.div
                        key="mask"
                        className="fixed inset-0"
                        style={{ zIndex }}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                        onContextMenu={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <motion.div
                            key="content"
                            className={clsx('fixed inset-0 flex items-center justify-center')}
                            style={{ zIndex: zIndex + 1 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                className={clsx('rounded-2xl p-4 text-gray-50 glass-bg')}
                                style={{
                                    width: typeof width === 'number' ? `${width}px` : width,
                                    height: typeof height === 'number' ? `${height}px` : height,
                                }}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ type: 'spring', duration: 0.55 }}
                            >
                                {children}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Modal
