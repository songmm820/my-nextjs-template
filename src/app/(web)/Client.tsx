'use client'

import { useAppConfig } from '@/components/context/AppConfigProvider'
import BackgroundContainer from '@/components/layout/BackgroundContainer'
import ContextMenu from '@/components/ui/ContextMenu'
import Modal from '@/components/ui/Modal'
import { useState } from 'react'

const Client = () => {
    const { backgroundColor, backgroundImage } = useAppConfig()

    const [open1, setOpen1] = useState(false)

    return (
        <ContextMenu options={['设置', '退出', '关于', '帮助', '退出全屏']}>
            <BackgroundContainer backgroundColor={backgroundColor} backgroundImage={backgroundImage}>
                在页面任意位置右键试试！
                <br />
                <button onClick={() => setOpen1(true)}>打开1{open1}</button>
                <br />
                <Modal open={open1} onClose={() => setOpen1(false)}>
                    123123
                </Modal>
            </BackgroundContainer>
        </ContextMenu>
    )
}

export default Client
