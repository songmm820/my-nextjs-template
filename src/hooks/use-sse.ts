import { useEffect, useRef } from 'react'

export type SSEOptions = {
  onOpen?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  onError?: (event: Event) => void
  withCredentials?: boolean
}

const useSSE = (url: string, options?: SSEOptions) => {
  const { onOpen, onMessage, onError, withCredentials = true } = options || {}
  const eventSource = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource(url, {
      withCredentials: withCredentials
    })
    eventSource.current = es
    es.onopen = (event) => {
      onOpen?.(event)
    }
    es.onmessage = (event) => {
      onMessage?.(event)
    }
    es.onerror = (event) => {
      onError?.(event)
    }
    return () => {
      es.close()
      if (eventSource.current) {
        eventSource.current = null
      }
    }
  }, [])
}

export default useSSE
