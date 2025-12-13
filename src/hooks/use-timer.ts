/**
 * 定时器hook（挂钟校准版）
 *
 * 一般定时器，在页面不可见时，会暂停或者降低频率，导致时间不准。
 * 这是因为受到浏览器的限制，对于不可见的标签页，浏览器会降低定时器的精度。
 */
import { useEffect, useState, useRef, useCallback } from 'react'

type Options = { time: number; step?: number }

export default function useTimer({ time, step = 1 }: Options) {
  const [timeLeft, setTimeLeft] = useState(time)
  // 剩余秒数（展示用）
  const [isCounting, setIsCounting] = useState(false)
  // 绝对截止时刻
  const deadlineRef = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const calcRemain = useCallback(() => {
    return Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000))
  }, [])

  const start = useCallback(() => {
    if (isCounting) return
    deadlineRef.current = Date.now() + timeLeft * 1000
    setIsCounting(true)
  }, [isCounting, timeLeft])

  const stop = useCallback(() => {
    setIsCounting(false)
  }, [])

  const reset = useCallback(() => {
    setIsCounting(false)
    setTimeLeft(time)
    deadlineRef.current = 0
  }, [time])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isCounting) {
      clearTimer()
      return
    }
    // 立即先算一次，防止 Interval 延迟
    setTimeout(() => setTimeLeft(calcRemain()), 0)
    // 定时刷新 UI（仅刷新，不累减）
    timerRef.current = setInterval(() => {
      const remain = calcRemain()
      setTimeLeft(remain)
      if (remain === 0) {
        clearTimer()
        setIsCounting(false)
      }
    }, step * 1000)
    return clearTimer
  }, [isCounting, step, calcRemain, clearTimer])

  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && isCounting) setTimeLeft(calcRemain())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [isCounting, calcRemain])

  useEffect(() => clearTimer, [clearTimer])

  return { time: timeLeft, isCounting, start, stop, reset, clearTimer }
}
