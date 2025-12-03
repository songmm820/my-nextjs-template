export class HttpResponse {
  static success<R>(data?: R) {
    if (data === null || data === undefined) {
      return {} as R
    }
    return {
      data: data
    }
  }

  static error(error: string, code?: number) {
    const r: { error: string; status_code?: number } = {
      error: error
    }
    if (code) {
      r.status_code = code
    }
    return r
  }
}
