import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import toast from 'react-hot-toast'
import { ErrorCode } from '~/shared/constants'

export type AxiosResponseType<R> = {
  data: R
  error?: string
}

/**
 * 请求拦截器配置
 *
 * 可以在这里统一设置请求头，token 等信息
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestInterceptorsConfig = (config: InternalAxiosRequestConfig<any>) => {
  return config
}

/**
 * 请求拦截器错误处理
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestInterceptorsError = (error: any) => {
  return Promise.reject(error)
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 响应拦截器配置
 *
 * 可以对响应数据进行处理
 */
const responseInterceptorsConfig = (response: AxiosResponse<any>) => {
  if (response?.data?.error) {
    // 处理参数错误，error 是一个错误数组
    if (response.data?.code === ErrorCode.PARAMS_ERROR) {
      const errorMessage = response.data.error
        .map((item: { field: string; message: string }) => `${item.field}: ${item.message}`)
        .join('\n')
      toast.error(errorMessage, {
        icon: '👎'
      })
    } else {
      toast.error(response.data.error, {
        icon: '👎'
      })
    }
  }
  return response.data
}

/**
 * 响应拦截器错误处理
 *
 * 可以对响应错误进行处理
 */
const responseInterceptorsError = (error: any) => {
  return Promise.reject(error)
}

/**
 * axios 实例
 *
 * 泛型：P：请求参数类型，R：响应数据类型
 */
export class AxiosClientClass {
  readonly instance: AxiosInstance
  private readonly config: AxiosRequestConfig

  constructor(config: AxiosRequestConfig) {
    this.config = config
    this.instance = axios.create(config)
    this.instance.interceptors.request.use(requestInterceptorsConfig, requestInterceptorsError)
    this.instance.interceptors.response.use(responseInterceptorsConfig, responseInterceptorsError)
  }

  getConfig(): AxiosRequestConfig {
    return this.config
  }

  setHeaders(key: string, value: string): this {
    this.instance.defaults.headers.common[key] = value
    return this
  }

  // 封装get请求
  get<P, R>(url: string, params?: P, config?: AxiosRequestConfig): Promise<AxiosResponseType<R>> {
    return this.instance.get(url, { params, ...config })
  }

  // 封装post请求
  post<P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<AxiosResponseType<R>> {
    return this.instance.post(url, data, config)
  }

  // 封装put请求
  put<P, R>(url: string, data?: P, config?: AxiosRequestConfig): Promise<AxiosResponseType<R>> {
    return this.instance.put(url, data, config)
  }

  // 封装delete请求
  delete<P, R>(
    url: string,
    params?: P,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponseType<R>> {
    return this.instance.delete(url, { params, ...config })
  }
}

// json
export const axiosInstance = new AxiosClientClass({
  baseURL: '',
  timeout: 6000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
