'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useZIndex } from '@/components/context/ComponentProvider'

interface ModalProps {
    children: React.ReactNode
    open?: boolean
    width?: string | number
    onClose?: () => void
}

const Modal = ({ children, open = false, width = '600px', onClose }: ModalProps) => {
    const zIndex = useZIndex()

    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose?.()
    }

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden' // 锁滚动
            document.addEventListener('keydown', handleEsc)
        }
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleEsc)
        }
    }, [open])

    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ zIndex: zIndex }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl p-6"
                            initial={{ scale: 0.9, opacity: 0 }}
                            style={{ width: typeof width === 'number' ? `${width}px` : width }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Modal
