'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Icon from '~/shared/components/Icon'
import clsx from 'clsx'
import Button from './Button'

export type ModalProps = {
  open: boolean
  title?: React.ReactNode
  children: React.ReactNode
  width?: number
  className?: string
  closeOnBackdrop?: boolean
  ariaLabel?: string
  cancelNode?: React.ReactNode
  okNode?: React.ReactNode
  isShowClose?: boolean
  onClose?: () => void
  onCancle?: () => void
  onOk?: () => void
}

const Modal = (props: ModalProps) => {
  const {
    open,
    title,
    width = 520,
    children,
    className,
    closeOnBackdrop = true,
    ariaLabel = 'Modal',
    cancelNode = 'Cancel',
    okNode = 'Ok',
    isShowClose = true,
    onClose,
    onCancle,
    onOk
  } = props
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

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

  const handleClose = () => {
    onClose?.()
  }

  const handleCancel = () => {
    onCancle?.()
    onClose?.()
  }

  const handleOk = () => {
    onOk?.()
  }

  useEffect(() => {
    if (open) {
      modalRef.current?.focus()
    }
  }, [open])

  // 水合期间，返回null
  if (typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence mode="wait">
      {open && (
        <div
          ref={modalRef}
          key="modal"
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

          <div className="relative z-20 flex min-h-screen items-center justify-center">
            <motion.div
              className={twMerge('rounded-lg bg-white shadow-2xl relative pt-4 pb-6', className)}
              style={{ width: `${width}px` }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {isShowClose && (
                <div
                  className={clsx(
                    'absolute -right-10 top-0 w-8 h-8',
                    'bg-white rounded-md flex items-center justify-center',
                    'cursor-pointer hover:bg-white/90 transition-colors duration-200'
                  )}
                  onClick={handleClose}
                >
                  <Icon name="close-small" size={22} color="#999999" />
                </div>
              )}

              {title && (
                <header className="mb-1.5 px-4 font-medium text-333 text-lg">{title}</header>
              )}
              <main className="px-4 max-h-100 overflow-auto">{children}</main>
              {(cancelNode || okNode) && (
                <footer className="mt-6 px-4 w-full flex items-center justify-center gap-6">
                  {cancelNode && (
                    <Button className="w-32 h-10" variant="outline" onClick={handleCancel}>
                      {cancelNode}
                    </Button>
                  )}
                  {okNode && (
                    <Button className="w-32 h-10" variant="primary" onClick={handleOk}>
                      {okNode}
                    </Button>
                  )}
                </footer>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
