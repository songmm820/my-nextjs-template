

export class HttpResponse {
  static success<R>(data?: R) {
    if (data === null || data === undefined) {
      return {} as R
    }
    return {
      data: data
    }
  }

  static error(error: string) {
    return {
      error: error
    }
  }
}
