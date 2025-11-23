/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from 'axios'

export class BizError extends Error {
    public response?: AxiosResponse

    constructor(message: string, response?: AxiosResponse) {
        super(message)
        this.name = 'BizError'
        this.response = response
    }
}

/**
 * 响应拦截器配置
 *
 * 可以对响应数据进行处理
 */
const responseInterceptorsConfig = (response: AxiosResponse<any>) => {
    return response.data
}

/**
 * 响应拦截器错误处理
 *
 * 可以对响应错误进行处理
 */
const responseInterceptorsError = (error: BizError) => {
    return Promise.reject(error)
}

export { responseInterceptorsConfig, responseInterceptorsError }
