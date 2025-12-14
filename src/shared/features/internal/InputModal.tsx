import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import Modal, { type ModalProps } from './Modal'

export type InputModalProps = Pick<
  ModalProps,
  'open' | 'onClose' | 'okText' | 'cancelText' | 'onCancel' | 'title' | 'container'
> & {
  value?: string
  onOk?: (value: string) => void
}

const InputModal = (props: InputModalProps) => {
  const {
    title,
    open,
    value,
    okText = 'Ok',
    onOk,
    cancelText = 'Cancel',
    onCancel,
    ...rest
  } = props
  const [inputValue, setInputValue] = useState(value ?? '')

  const handleCancel = () => {
    onCancel?.()
  }

  const handleOk = () => {
    onOk?.(inputValue)
  }

  return (
    <Modal
      {...rest}
      open={open}
      title={<div className="text-center text-lg">{title}</div>}
      isShowClose={false}
      width={420}
      customFooter={
        <footer className="mt-4 px-12 w-full flex flex-col gap-3">
          <Button className="w-full h-10 rounded-full" variant="primary" onClick={handleOk}>
            {okText}
          </Button>
          <Button className="w-full h-10" variant="link" onClick={handleCancel}>
            {cancelText}
          </Button>
        </footer>
      }
    >
      <div className="w-full px-8 py-4">
        <Input
          className="w-full rounded-full"
          autoFocus
          value={inputValue ?? ''}
          onChange={(value) => {
            setInputValue(value)
          }}
        />
      </div>
    </Modal>
  )
}

export default InputModal
