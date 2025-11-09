'use client'

import { useAppConfig } from '@/components/context/AppConfigProvider'
import BackgroundContainer from '@/components/layout/BackgroundContainer'
import ContextMenu from '@/components/ui/ContextMenu'
import Modal from '@/components/ui/Modal'

const Client = () => {
    const { backgroundColor, backgroundImage } = useAppConfig()

    return (
        <ContextMenu options={['设置', '退出', '关于', '帮助', '退出全屏']}>
            <BackgroundContainer backgroundColor={backgroundColor} backgroundImage={backgroundImage}>
                在页面任意位置右键试试！
                <Modal open={true}>123</Modal>
            </BackgroundContainer>
        </ContextMenu>
    )
}

export default Client
