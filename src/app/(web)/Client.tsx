'use client'

import { useAppConfig } from '@/components/context/AppConfigProvider'
import BackgroundContainer from '@/components/layout/BackgroundContainer'
import ContextMenu from '@/components/ui/ContextMenu'
import Clock from '@/components/widget/Clock'

const Client = () => {
    const { backgroundColor, backgroundImage } = useAppConfig()

    return (
        <ContextMenu options={['设置', '退出', '关于', '帮助', '退出全屏']}>
            <BackgroundContainer backgroundColor={backgroundColor} backgroundImage={backgroundImage}>
                <div onContextMenu={(e) => e.stopPropagation()} className="flex flex-col justify-center items-center p-6">
                    <Clock />
                </div>
            </BackgroundContainer>
        </ContextMenu>
    )
}

export default Client
