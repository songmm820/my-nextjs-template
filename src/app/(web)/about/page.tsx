'use client'

import { useState } from 'react'
import Empty from '~/shared/components/Empty'
import PictureCropper from '~/shared/components/PictureCropper'
import { Button, Modal } from '~/shared/features'

const AboutPage = () => {
  const [openModal, setOpenModal] = useState(false)
  const [preview, setPreview] = useState<string>('')

  return (
    <div className="h-auto w-120 mx-auto flex flex-col justify-center gap-4">
      <Empty />
      <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
      <Modal title="Setting" open={openModal} onClose={() => setOpenModal(false)}>
        <div className="h-20">Open</div>
      </Modal>

      <div className="w-full flex flex-col">
        <PictureCropper
          className="flex-1"
          size={200}
          src="/images/example/v2-example.jpg"
          onCropComplete={(blob) => setPreview(URL.createObjectURL(blob))}
        />
        {preview && (
          <div>
            <img src={preview} alt="preview" className="w-40 h-40" />
          </div>
        )}
      </div>
    </div>
  )
}

export default AboutPage
