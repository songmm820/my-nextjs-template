// Http Response
export interface HttpResponse<R> {
    error?: string
    data?: R
    timestamp: number
}

export class HttpResponseBuilder<R> {
    private error?: string
    private data?: R

    // 设置数据
    public withData(data: R): HttpResponseBuilder<R> {
        this.data = data
        return this
    }

    // 设置错误信息
    public withError(error: string): HttpResponseBuilder<R> {
        this.error = error
        return this
    }

    // 构建最终的响应对象
    public build(): { data?: R; error?: string } {
        return {
            data: this.data,
            error: this.error
        }
    }

    // 静态方法构建成功响应，指定泛型类型
    static success<R>(data: R): HttpResponseBuilder<R> {
        return new HttpResponseBuilder<R>().withData(data)
    }

    // 静态方法构建错误响应，指定泛型类型
    static error(error: string): HttpResponseBuilder<void> {
        return new HttpResponseBuilder<void>().withError(error)
    }
}
