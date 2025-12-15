export class HttpResponse {
  static success<R>(data?: R) {
    if (data === null || data === undefined) {
      return {} as R
    }
    return {
      data: data
    }
  }

  static error(error: string | unknown, code?: number) {
    const r: { error: string | unknown; code?: number } = {
      error: error
    }
    if (code) {
      r.code = code
    }
    return r
  }
}

export class HttpApiError extends Error {
  constructor(public readonly message: string) {
    super(message)
    this.name = 'HttpApiError'
  }
}
