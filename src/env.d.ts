declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: any
        }
    }
}

export {}