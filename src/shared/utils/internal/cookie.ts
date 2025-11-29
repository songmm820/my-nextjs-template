import 'server-only'

import { cookies } from 'next/headers'

/**
 * 安全设置 cookie
 *
 * @param key 键
 * @param value 值
 */

export async function setCookieSafe(key: string, value: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(key, value, {
    // 7天过期
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })
}

/**
 * 安全获取 cookie
 */
export async function getCookieSafe(key: string): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(key)?.value || null
}
