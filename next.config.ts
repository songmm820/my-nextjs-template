import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import dotenv from 'dotenv'

dotenv.config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'
})

// eslint-disable-next-line no-console
console.log(` ========== 当前APP环境：${process.env.APP_ENV} ==========`)

const nextConfig: NextConfig = {
  /**
   * 开启 React 的严格模式，它可以帮助捕获潜在的错误和不推荐的用法。
   */
  reactStrictMode: true,

  /**
   * 启用或禁用 URL 结尾的斜杠。当设置为 true 时，所有页面将以斜杠结尾。
   */
  trailingSlash: false,

  /**
   * 启用或禁用 Next.js 的类型路由功能。类型路由允许你使用 TypeScript 定义路由。
   */
  typedRoutes: true,

  /**
   * 禁用 Next.js 的 Powered By Header。
   * 默认情况下，Next.js 会添加一个 "x-powered-by" 的响应头。
   */
  poweredByHeader: false,

  /**
   * 配置页面的扩展名。默认情况下，Next.js 识别 .js、.jsx、.ts 和 .tsx 扩展名的页面。你可以自定义它。
   *
   * 支持的页面扩展名, 默认值是 ['js', 'jsx', 'ts', 'tsx']
   */
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  /**
   * nextjs将生成电子标签，以帮助缓存控制。
   */
  generateEtags: true,

  /**
   * 开启 Next.js 的开发指示器，它可以帮助你调试和优化你的应用。
   */
  devIndicators: {
    position: 'bottom-left'
  },

  /**
   * 默认情况下，Next.js 在使用 或 自定义服务器时用于压缩渲染的内容和静态文件。这是针对未配置压缩的应用程序的优化。
   * 除非在服务器上配置了压缩，否则不建议禁用压缩，因为压缩会减少带宽使用并提高应用程序的性能。
   */
  compress: true,

  /**
   * 要在域的子路径下部署Next.js应用程序时，请将此选项设置为子路径。
   */
  basePath: '',

  /**
   * 用于配置 Next.js 的图像优化功能。你可以定义允许的域名、图像尺寸、格式等
   */
  images: {
    /**
     * 允许在开发环境中使用未优化的图像
     */
    unoptimized: true,
    remotePatterns: []
  },

  /**
   * 防止私密数据意外暴露给客户端
   */
  experimental: {
    taint: true
  },

  /**
   * 许您设置可在开发模式下使用的其他源，以避免 CORS 错误。
   */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],

  /**
   * 您可以指定要用于自定义构建目录的名称
   */
  distDir: '.next'

  /**
   * Next.js 应用程序的构建输出格式。
   */
  // output: 'standalone'
}

/* This is the default configuration for the plugin. You can customize it as needed. */
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
