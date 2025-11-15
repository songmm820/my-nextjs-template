'use client'

import { useAppConfig } from '@/components/context/AppConfigProvider'
import BackgroundContainer from '@/components/layout/BackgroundContainer'
import ContextMenu from '@/components/ui/ContextMenu'
import Clock from '@/components/widget/Clock'
import { useState } from 'react'

const Client = () => {
    const { backgroundColor, backgroundImage } = useAppConfig()

    return (
        <ContextMenu options={['设置', '退出', '关于', '帮助', '退出全屏']}>
            <BackgroundContainer backgroundColor={backgroundColor} backgroundImage={backgroundImage}>
                <div className="w-full h-full flex flex-col items-center p-6">
                    <Clock />
                </div>
            </BackgroundContainer>
        </ContextMenu>
    )
}

export default Client
