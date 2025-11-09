'use client'

import { useAppConfig } from '@/components/context/AppConfigProvider'
import BackgroundContainer from '@/components/layout/BackgroundContainer'
import ContextMenu from '@/components/ui/ContextMenu'

const Client = () => {
    const { backgroundColor, backgroundImage } = useAppConfig()

    return (
        <ContextMenu
            options={[
                {
                    label: '设置',
                },
                {
                    label: '设置',
                },
                {
                    label: '设置',
                },
                {
                    label: '设置',
                },
            ]}
        >
            <BackgroundContainer backgroundColor={backgroundColor} backgroundImage={backgroundImage}>
                在页面任意位置右键试试！
            </BackgroundContainer>
        </ContextMenu>
    )
}

export default Client
