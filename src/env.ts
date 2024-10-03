import { Env } from './env.d';

const env: Env = {
    JWT_SECRET: process.env.JWT_SECRET!,
    SRV_PORT: parseInt(process.env.SRV_PORT!, 10),
    DB_USER: process.env.DB_USER!,
    DB_HOST: process.env.DB_HOST!,
    DB_NAME: process.env.DB_NAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_PORT: parseInt(process.env.DB_PORT!, 10),
    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASS: process.env.EMAIL_PASS!,
    SRV_HOST: process.env.SRV_HOST!,
};

export default env;