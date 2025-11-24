import { cookies } from 'next/headers'

/**
 * 安全调用 cookie
 *
 * @param key 键
 * @param value 值
 */
export async function setCookieSafe(key: string, value: string): Promise<void> {
  const cookieStore = await cookies()
  if (!cookieStore) return
  cookieStore.set(key, value)
}
