/**
 * 对于更高级的分析和监控需求，Next.js提供了一个在应用程序的前端代码开始执行之前运行的文件。
 * 这非常适合设置全局分析、错误跟踪或性能监控工具。
 *
 * @see https://nextjs.org/docs/app/guides/analytics
 */

// Initialize analytics before the app starts
// eslint-disable-next-line no-console
console.log('Analytics initialized')

// Set up global error tracking
window.addEventListener('error', (event) => {
    // Send to your error tracking service
    reportError(event.error)
})
