/**
 * 在 Next.js 中，robots.txt 文件通常用于告诉搜索引擎爬虫哪些页面应该被索引，哪些页面应该被忽略。
 * 它是一个标准的 搜索引擎优化 (SEO) 文件，用于控制和管理搜索引擎如何访问和索引你的网站内容。
 *
 * @see https://nextjscn.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  /**
   * User-agent：指定搜索引擎的爬虫（* 表示所有爬虫）
   * Disallow：禁止爬虫访问的路径（例如 /admin/）
   * Allow：允许爬虫访问的路径
   * Sitemap：指定站点的 Sitemap URL，以便搜索引擎更高效地抓取页面
   */
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ''
      }
    ],
    sitemap: 'https://acme.com/sitemap.xml'
  }
}
