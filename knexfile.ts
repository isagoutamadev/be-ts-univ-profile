require("ts-node/register");

import type { Knex } from "knex";
import "dotenv/config";
import path from "path";

// Update with your config settings.

const config: Knex.Config = {
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
    migrations: {
        tableName: process.env.DATABASE_MIGRATION_TABLE,
        directory: __dirname + '/database/migrations',
    },
    seeds: {
        directory: __dirname + '/database/seeds',
    },
};

module.exports = config;