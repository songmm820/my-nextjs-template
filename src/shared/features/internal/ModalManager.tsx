import { createRoot } from 'react-dom/client'
import type { ModalProps } from './Modal'
import Modal from './Modal'
import toast from 'react-hot-toast'

type ModalConfig = Omit<ModalProps, 'open'>

let currentRoot: ReturnType<typeof createRoot> | null = null
let currentContainer: HTMLDivElement | null = null

const duration = 300

type ConfirmModalOptions = {
  isDelete?: boolean
  title?: string
  content?: string
  okText?: string
  okCallback?: () => void
  cancelText?: string
  cancelCallback?: () => void
}
const ConfirmModal = (options: ConfirmModalOptions) => {
  if (!document) return
  // 清理之前的实例
  if (currentRoot && currentContainer) {
    currentRoot.unmount()
    document.body.removeChild(currentContainer)
  }
  // 创建容器
  const container = document.createElement('div')
  container.setAttribute('data-modal-root', 'true')
  document.body.appendChild(container)
  const config: ModalConfig = {
    container: container,
    isShowClose: false,
    duration: duration,
    width: 420,
    title: <div className="text-center text-lg">{options?.title || 'Kind Notice'}</div>,
    cancelText: options.okText,
    onOk: () => {
      options.okCallback?.()
      handleClose()
    },
    onCancel: () => {
      options.cancelCallback?.()
      handleClose()
    },
    children: <div className="text-center text-999">{options?.content}</div>
  }
  currentContainer = container
  const root = createRoot(container)
  currentRoot = root
  const handleClose = () => {
    root.render(<Modal {...config} open={false} onClose={() => {}} />)
    // 动画结束后清理
    setTimeout(() => {
      root.unmount()
      if (container.parentNode) {
        document.body.removeChild(container)
      }
      currentRoot = null
      currentContainer = null
    }, duration) // 与动画时长一致
  }

  // 打开弹窗
  root.render(
    <Modal {...config} open={true} onClose={handleClose}>
      {config.children}
    </Modal>
  )
}

const ModalManager = {
  confirm: ConfirmModal,
  success: (message: string) =>
    toast.success(message, {
      icon: '👏'
    }),
  error: (message: string) =>
    toast.error(message, {
      icon: '👎'
    })
}

export default ModalManager
