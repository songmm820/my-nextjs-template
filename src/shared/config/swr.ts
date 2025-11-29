import useSWRMutation from 'swr/mutation'
import { type AxiosResponseType } from './axios-config'

/**
 * 基于 axios 的 useSwr 请求函数
 *
 * @param key swr 缓存key
 * @param apiFn axios 请求函数
 * @returns useSwr 请求函数
 */
export function createSwrMutation<P, R>(
  key: string,
  apiFn: (p: P) => Promise<AxiosResponseType<R>>
) {
  return () => useSWRMutation(key, (_, { arg }: { arg: P }) => apiFn(arg))
}

export function createSwrBlobMutation<P, R>(
  key: string,
  apiFn: (p: P) => Promise<R>
) {
  return () => useSWRMutation(key, (_, { arg }: { arg: P }) => apiFn(arg))
}
