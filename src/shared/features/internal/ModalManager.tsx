import { createRoot } from 'react-dom/client'
import type { ModalProps } from './Modal'
import Modal from './Modal'
import InputModal from './InputModal'
import toast from 'react-hot-toast'

type ModalConfig = Omit<ModalProps, 'open'>

let currentRoot: ReturnType<typeof createRoot> | null = null
let currentContainer: HTMLDivElement | null = null

const duration = 300

/**
 * 渲染Modal
 *
 * @param rootId 容器id
 * @param config Modal 配置
 */
function renderModal<T extends ModalConfig>(rootId: string, config: T) {
  if (!document) return
  // 清理之前的实例
  if (currentRoot && currentContainer) {
    currentRoot.unmount()
    document.body.removeChild(currentContainer)
  }
  // 创建容器
  const container = document.createElement('div')
  container.setAttribute(rootId, 'true')
  document.body.appendChild(container)
  currentContainer = container
  const root = createRoot(container)
  currentRoot = root

  const newConfig = {
    ...config,
    container: container,
    onCancel: () => {
      config.onCancel?.()
      handleClose()
    },
    onOk: () => {
      config.onOk?.()
      handleClose()
    }
  }

  const handleClose = () => {
    root.render(<Modal {...newConfig} open={false} onClose={() => {}} />)
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
    <Modal {...newConfig} open={true} onClose={handleClose}>
      {config.children}
    </Modal>
  )
}

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
  const config: ModalConfig = {
    isShowClose: false,
    duration: duration,
    width: 420,
    title: <div className="text-center text-lg">{options?.title || 'Kind Notice'}</div>,
    cancelText: options.okText,
    onOk: () => {
      options.okCallback?.()
    },
    onCancel: () => {
      options.cancelCallback?.()
    },
    children: <div className="text-center text-999">{options?.content}</div>
  }

  renderModal<ModalConfig>('modal-confirm-root', config)
}

type InputModalOptions = {
  value?: string
  title?: string
  okText?: string
  okCallback?: (value: string) => void
  cancelText?: string
  cancelCallback?: () => void
}
const InputValueModal = (options: InputModalOptions) => {
  if (!document) return
  // 清理之前的实例
  if (currentRoot && currentContainer) {
    currentRoot.unmount()
    document.body.removeChild(currentContainer)
  }
  // 创建容器
  const container = document.createElement('div')
  container.setAttribute('data-modal-input-root', 'true')
  document.body.appendChild(container)
  currentContainer = container
  const root = createRoot(container)
  currentRoot = root

  const handleClose = () => {
    root.render(<InputModal {...newConfig} open={false} />)
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

  const newConfig = {
    container: container,
    onCancel: () => {
      options.cancelCallback?.()
      handleClose()
    }
  }

  root.render(
    <InputModal
      {...newConfig}
      title={options?.title}
      open={true}
      value={options?.value ?? ''}
      onClose={handleClose}
      onOk={(value: string) => {
        options?.okCallback?.(value)
        handleClose()
      }}
    />
  )
}

const ModalManager = {
  confirm: ConfirmModal,
  input: InputValueModal,
  success: (message: string) =>
    toast.success(message, {
      icon: '👏'
    }),
  error: (message: string) =>
    toast.error(message, {
      icon: '👎'
    }),
  warning: (message: string) =>
    toast(message, {
      icon: '⚠️'
    })
}

export default ModalManager
