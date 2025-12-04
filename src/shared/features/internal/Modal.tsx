'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  closeOnBackdrop?: boolean
  ariaLabel?: string
}

function Modal({
  open,
  onClose,
  children,
  className,
  closeOnBackdrop = true,
  ariaLabel
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // 2. 锁定滚动
  useEffect(() => {
    const source = document.body.style.overflow
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = source
    }
    return () => {
      document.body.style.overflow = source
    }
  }, [open])

  // 3. 焦点管理
  useEffect(() => {
    if (open) {
      modalRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          ref={modalRef}
          className="fixed inset-0 isolate z-100 outline-none"
          role="dialog"
          aria-modal={true}
          aria-label={ariaLabel}
          tabIndex={-1}
        >
          <motion.div
            className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          <div className="relative z-20 flex min-h-screen items-center justify-center p-4">
            <motion.div
              className={twMerge('w-full max-w-md rounded-xl bg-white p-6 shadow-2xl', className)}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
