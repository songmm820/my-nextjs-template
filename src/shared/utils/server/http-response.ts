export class HttpResponse {
  static success<R>(data?: R) {
    if (data === null || data === undefined) {
      return {} as R
    }
    return {
      data: data
    }
  }

  static error(error: string | Array<string>, code?: number) {
    const r: { error: string | Array<string>; code?: number } = {
      error: error
    }
    if (code) {
      r.code = code
    }
    return r
  }
}
