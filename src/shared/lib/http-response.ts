// Http Response
export interface HttpResponse<R> {
    status_code: number
    error_message?: string
    data?: R
    timestamp: number
}

export class HttpResponseBuilder<R> {
    private status_code: number
    private error_message?: string
    private data?: R

    // 构造函数，接受 status_code
    constructor(status_code: number) {
        this.status_code = status_code
    }

    // 设置数据
    public withData(data: R): HttpResponseBuilder<R> {
        this.data = data
        return this
    }

    // 设置错误信息
    public withError(error_message: string): HttpResponseBuilder<R> {
        this.error_message = error_message
        return this
    }

    // 构建最终的响应对象
    public build(): { status_code: number; data?: R; error_message?: string } {
        return {
            status_code: this.status_code,
            data: this.data,
            error_message: this.error_message
        }
    }

    // 静态方法构建成功响应，指定泛型类型
    static success<R>(data: R): HttpResponseBuilder<R> {
        return new HttpResponseBuilder<R>(200).withData(data)
    }

    // 静态方法构建错误响应，指定泛型类型
    static error(status_code: number, error_message: string): HttpResponseBuilder<void> {
        return new HttpResponseBuilder<void>(status_code).withError(error_message)
    }
}
