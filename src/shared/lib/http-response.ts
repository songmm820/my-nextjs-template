// Http Response
export interface HttpResponse<R> {
    status_code: number
    error_message?: string
    data: R
    timestamp: number
}

export function buildHttpResponse<R>(options: { status_code: number; data: R }): HttpResponse<R>

export function buildHttpResponse<R>(options: { status_code: number; error_message?: string; data: R }): HttpResponse<R>

export function buildHttpResponse<R>(options: {
    status_code: number
    error_message?: string
    data: R
}): HttpResponse<R> {
    const res: HttpResponse<R> = {
        status_code: options.status_code,
        data: options.data,
        timestamp: Date.now()
    }

    if (options.error_message) {
        res.error_message = options.error_message
    }

    return res
}
