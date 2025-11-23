declare namespace NodeJS {
    interface ProcessEnv {
        readonly DATABASE_URL: string
        readonly DATABASE_USER: string
        readonly DATABASE_PASSWORD: string
        readonly DATABASE_HOST: string
        readonly DATABASE_PORT: string

        readonly GITHUB_CLIENT_ID: string
        readonly GITHUB_SECRET: string
        // 继续追加其他变量...
    }
}
