'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Icon from '~/shared/components/Icon'
import clsx from 'clsx'
import Button from './Button'

export type ModalProps = {
  open?: boolean
  title?: React.ReactNode
  children?: React.ReactNode
  width?: number
  className?: string
  okText?: string | null
  cancelText?: string | null
  isShowClose?: boolean
  isShowFullScreen?: boolean
  isFullScreen?: boolean
  container?: HTMLElement
  duration?: number
  customFooter?: React.ReactNode
  onClose?: () => void
  onCancel?: () => void
  onOk?: () => void
}

const Modal = (props: ModalProps) => {
  const {
    open = false,
    title,
    width = 400,
    children,
    className,
    cancelText = 'Cancel',
    okText = 'Confirm',
    customFooter,
    isShowClose = true,
    isShowFullScreen = false,
    isFullScreen = false,
    container,
    duration = 300,
    onClose,
    onCancel,
    onOk
  } = props
  const modalRef = useRef<HTMLDivElement>(null)
  const [isFullScreenVal, setIsFullScreenVal] = useState<boolean>(isFullScreen)

  const handleClose = () => {
    onClose?.()
    setIsFullScreenVal(false)
  }

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
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

  const handleCancel = () => {
    if (!onCancel) {
      handleClose()
    } else {
      onCancel?.()
      setIsFullScreenVal(false)
    }
  }

  const handleOk = () => {
    if (!onOk) {
      handleClose()
    } else {
      onOk?.()
    }
  }

  // 点击切换全屏
  const handleFullScreen = () => {
    setIsFullScreenVal(!isFullScreenVal)
  }

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
          aria-label="Modal"
          tabIndex={-1}
        >
          <motion.div
            className="absolute inset-0 z-10 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <div className="relative z-20 flex min-h-screen items-center justify-center">
            <motion.div
              className={twMerge(
                'rounded-3xl bg-white relative pt-4 pb-6 flex flex-col px-8',
                className
              )}
              style={{
                width: isFullScreenVal ? '100vw' : `${width}px`,
                height: isFullScreenVal ? '100vh' : 'auto'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                type: 'spring',
                stiffness: duration,
                damping: 30,
                mass: 1.2
              }}
            >
              <div className={clsx('absolute right-1 top-1 flex flex-col gap-2')}>
                {isShowClose && (
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg',
                      'bg-white/10 flex items-center justify-center',
                      'cursor-pointer hover:bg-white/90 transition-colors duration-200'
                    )}
                    onClick={handleClose}
                  >
                    <Icon name="close" size={18} color="#999999" />
                  </div>
                )}

                {isShowFullScreen && (
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-lg',
                      'bg-white flex items-center justify-center',
                      'cursor-pointer hover:bg-white/90 transition-colors duration-200'
                    )}
                    onClick={handleFullScreen}
                  >
                    <Icon name="expand-text-input" size={20} color="#999999" />
                  </div>
                )}
              </div>

              {title && <header className="mb-3 font-medium text-333 text-lg">{title}</header>}
              <main className="mt-3 flex-1 max-h-200">{children}</main>
              {customFooter ? (
                customFooter
              ) : (
                <footer className="mt-6 w-full flex flex-col items-center justify-center gap-3">
                  {okText && (
                    <Button className="w-full h-10" variant="primary" onClick={handleOk}>
                      {okText}
                    </Button>
                  )}
                  {cancelText && (
                    <Button className="w-full h-10" variant="outline" onClick={handleCancel}>
                      {cancelText}
                    </Button>
                  )}
                </footer>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    container ?? document.body
  )
}

export default Modal
