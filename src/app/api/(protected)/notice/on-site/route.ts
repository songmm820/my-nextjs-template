import { type NextRequest, NextResponse } from 'next/server'

// 禁用静态生成
export const dynamic = 'force-dynamic'
// 禁用缓存
export const revalidate = 0
// 推荐：使用 Edge Runtime 避免 Node
export const runtime = 'edge'

const encoder = new TextEncoder()

// sse推送
const sendMessage = <T>(controller: ReadableStreamDefaultController, message: T) => {
  const sseData = encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
  controller.enqueue(sseData)
}

// 通知-站内 sse推送
export async function GET(request: NextRequest) {
  const stream = new ReadableStream<string>({
    start(controller) {
      const interval = setInterval(() => {
        sendMessage(controller, {
          message: 'Hello, World!'
        })
      }, 5000)

      // 检查心跳
      const heartbeatInterval = setInterval(() => {
        sendMessage(controller, {
          message: 'ping'
        })
      }, 2500)

      // 监听连接中断
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        clearInterval(heartbeatInterval)
        controller.close()
      })
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
