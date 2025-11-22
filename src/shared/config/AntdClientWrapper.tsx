'use client'
// ant-design react19 兼容包
import '@ant-design/v5-patch-for-react-19'

const AntdClientWrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
}

export default AntdClientWrapper
