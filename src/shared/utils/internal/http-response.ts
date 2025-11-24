class HttpResponse {
  static success<R>(data: R) {
    return {
      dt: data || {},
      at: Date.now()
    }
  }

  static error(error: string) {
    return {
      er: error,
      at: Date.now()
    }
  }
}

export default HttpResponse
