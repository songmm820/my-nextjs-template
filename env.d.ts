declare namespace NodeJS {
  interface ProcessEnv {
    readonly DATABASE_URL: string
    readonly DATABASE_USER: string
    readonly DATABASE_PASSWORD: string
    readonly DATABASE_HOST: string
    readonly DATABASE_PORT: string

    readonly GITHUB_CLIENT_ID: string
    readonly GITHUB_SECRET: string

    readonly REDIS_PASSWORD: string
    readonly REDIS_PORT: string
    readonly REDIS_HOST: string

    readonly MINIO_USE_SSL: string
    readonly MINIO_ENDPOINT: string
    readonly MINIO_PORT: string
    readonly MINIO_ACCESS_KEY: string
    readonly MINIO_SECRET_KEY: string
    readonly MINIO_BUCKET_NAME: string
    // 继续追加其他变量...
  }
}
