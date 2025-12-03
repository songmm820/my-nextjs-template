import 'client-only'

const PREFIX = 'NICK_'

export const MyLocalStorage = {
  get<T>(key: string): T | null {
    const value = localStorage.getItem(`${PREFIX}${key}`)
    if (value === null) {
      return null
    }
    try {
      return JSON.parse(value as string) as T
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // json 解析失败当作字符串处理
      return value as unknown as T
    }
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
  },
  remove(key: string): void {
    localStorage.removeItem(`${PREFIX}${key}`)
  },

  clear(): void {
    localStorage.clear()
  }
}

export const MySessionStorage = {
  get<T>(key: string): T | null {
    const value = sessionStorage.getItem(`${PREFIX}${key}`)
    if (value === null) {
      return null
    }
    try {
      return JSON.parse(value as string) as T
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // json 解析失败当作字符串处理
      return value as unknown as T
    }
  },

  set<T>(key: string, value: T): void {
    sessionStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value))
  },
  remove(key: string): void {
    sessionStorage.removeItem(`${PREFIX}${key}`)
  },

  clear(): void {
    sessionStorage.clear()
  }
}

