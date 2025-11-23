import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

/* config options here */
const nextConfig: NextConfig = {
    /* 严格模式 */
    reactStrictMode: true,
    /* 尾随斜杠 */
    trailingSlash: false,
    /* 类型路由 */
    typedRoutes: true,
    /** 默认情况下Next.js将添加标头 */
    poweredByHeader: false,
    /** Next.js 接受扩展名 */
    pageExtensions: ['ts', 'tsx'],
    /** Next.js将生成电子标签 */
    generateEtags: true,
    /** 配置屏幕上的指示器 */
    devIndicators: {
        position: 'bottom-left'
    },
    /* 配置压缩 */
    compress: true,
    /* 要在域的子路径下部署Next.js应用程序 */
    basePath: '',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com'
            }
        ]
    }
}

/* This is the default configuration for the plugin. You can customize it as needed. */
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
