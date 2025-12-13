'use client'

import { useState } from 'react'
import Empty from '~/shared/components/Empty'
import { Button, Modal, ModalManager } from '~/shared/features'

const AboutPage = () => {
  const [openModal, setOpenModal] = useState(false)

  return (
    <div className="h-auto w-120 mx-auto flex flex-col justify-center gap-4">
      <Empty />
      <Button
        onClick={() =>
          ModalManager.confirm({
            content: 'Open Modal',
            okCallback: () => {}
          })
        }
      >
        Open Modal
      </Button>
      <Button onClick={() => ModalManager.success('success')}>Toast</Button>
      <Button onClick={() => ModalManager.error('error')}>Toast</Button>
      <Button
        onClick={() =>
          ModalManager.input({
            value: 'value 123...'
          })
        }
      >
        Input
      </Button>
      <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
      <Modal title="Setting" open={openModal} onClose={() => setOpenModal(false)}>
        <div className="h-20">Open</div>
      </Modal>
    </div>
  )
}

export default AboutPage
