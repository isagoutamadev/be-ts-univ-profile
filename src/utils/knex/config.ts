const config = {
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
    },
    pool: {
        min: Number(process.env.DATABASE_POOL_MIN),
        max: Number(process.env.DATABASE_POOL_MAX),
    },
};

export default config;
