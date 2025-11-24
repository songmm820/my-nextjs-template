import { useEffect, useRef, useState } from 'react'

function useClock() {
  const [time, setTime] = useState<number | null>(null) // 初始为 null
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const animationRef = useRef<number>(0)
  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return
    let lastTimestamp = performance.now()
    startTimeRef.current = Date.now()
    // 客户端才设置时间
    setTime(startTimeRef.current)
    const updateTime = (timestamp: number) => {
      const elapsed = timestamp - lastTimestamp
      lastTimestamp = timestamp
      animationRef.current += elapsed
      if (animationRef.current >= 100) {
        setTime(Date.now())
        animationRef.current = 0
      }
      rafRef.current = requestAnimationFrame(updateTime)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      } else {
        setTime(Date.now())
        lastTimestamp = performance.now()
        animationRef.current = 0
        rafRef.current = requestAnimationFrame(updateTime)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    rafRef.current = requestAnimationFrame(updateTime)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // 服务端返回 null，客户端返回时间
  return time
}

export default useClock
