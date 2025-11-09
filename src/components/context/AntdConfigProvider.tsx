'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AntdClientWrapper from '@/components/config/AntdClientWrapper'
import { useAppConfig } from './AppConfigProvider'
// for date-picker i18n
// import 'dayjs/locale/zh-cn'

const AntdConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const { primaryColor } = useAppConfig()

    return (
        <AntdClientWrapper>
            <ConfigProvider
                locale={zhCN}
                componentSize="large"
                theme={{
                    token: {
                        colorPrimary: primaryColor,
                        colorSuccess: '#52c41a',
                        colorWarning: '#faad14',
                        colorError: '#ff4d4f',
                        colorTextBase: '#000',
                        fontFamily: '-apple-system, Noto Sans SC',
                        borderRadius: 8,
                    },
                }}
                prefixCls="my"
                variant="filled"
                wave={{ disabled: true }}
            >
                {children}
            </ConfigProvider>
        </AntdClientWrapper>
    )
}

export default AntdConfigProvider
