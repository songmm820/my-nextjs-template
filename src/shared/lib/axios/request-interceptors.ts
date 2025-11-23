import type { InternalAxiosRequestConfig } from 'axios';

/**
 * 请求拦截器配置
 *
 * 可以在这里统一设置请求头，token 等信息
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestInterceptorsConfig = (config: InternalAxiosRequestConfig<any>) => {
    return config;
};

/**
 * 请求拦截器错误处理
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestInterceptorsError = (error: any) => {
    return Promise.reject(error);
};

export { requestInterceptorsConfig, requestInterceptorsError };
