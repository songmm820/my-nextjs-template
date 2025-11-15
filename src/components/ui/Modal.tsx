'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useZIndex } from '@/components/context/ComponentProvider'

interface ModalProps {
    children: React.ReactNode
    open?: boolean
    width?: string | number
    height?: string | number
    onClose?: () => void
}

const Modal = ({ children, open = false, width = '600px', height = '600px', onClose }: ModalProps) => {
    const zIndex = useZIndex()

    useEffect(() => {
        if (!open) return
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose?.()
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleEsc)
        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleEsc)
        }
    }, [open, onClose])

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* 遮罩层：只它负责半透明+模糊 */}
                    <motion.div
                        key="mask"
                        className="fixed inset-0 backdrop-blur-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
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
                            className={`fixed inset-0 
                                flex items-center justify-center backdrop-blur-lg
                                shadow-[#00000080_0_10px_30px]`}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            style={{ zIndex: zIndex + 1 }} // 保证内容比遮罩高一层
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className={`rounded-2xl bg-light-glass 
                                    shadow-[#00000080_0_10px_30px] 
                                    text-gray-50 p-4 
                                    border-2 border-[rgba(255,255,255,0.26)]`}
                                style={{
                                    width: typeof width === 'number' ? `${width}px` : width,
                                    height: typeof height === 'number' ? `${height}px` : height,
                                }}
                            >
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Modal
