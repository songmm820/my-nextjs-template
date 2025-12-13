import { useState } from 'react'
import clsx from 'clsx'
import PictureCropper from '~/shared/components/PictureCropper'
import { Modal } from '~/shared/features'
import { selectFile } from '~/shared/utils/client/file'

type AvatarSettingModalProps = {
  open: boolean
  url?: string
  onClose: () => void
  onCropComplete?: (blob: Blob) => void
}

const AvatarSettingModal = (props: AvatarSettingModalProps) => {
  const { open, onClose, onCropComplete } = props
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [cropBlob, setCropBlob] = useState<Blob | null>(null)

  const handleSelectFile = async () => {
    const file = await selectFile('image/*')
    if (file) {
      setFileUrl(URL.createObjectURL(file))
    }
  }

  const handleOk = () => {
    if (cropBlob) {
      onCropComplete?.(cropBlob)
    }
    onClose()
  }

  return (
    <Modal
      title="Avatar Setting"
      open={open}
      onClose={onClose}
      cancelText="Select Again"
      onCancel={handleSelectFile}
      onOk={handleOk}
    >
      {fileUrl ? (
        <div className="h-80 flex items-center">
          <PictureCropper src={fileUrl} onCropComplete={(blob) => setCropBlob(blob)} />
        </div>
      ) : (
        <div
          className={clsx(
            'h-80 w-full border border-dashed cursor-pointer',
            'flex flex-col items-center justify-center rounded-md',
            'border-primary/60 hover:border-primary translation-all duration-300'
          )}
          onClick={handleSelectFile}
        ></div>
      )}
    </Modal>
  )
}

export default AvatarSettingModal
