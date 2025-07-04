import dotenv from 'dotenv'

dotenv.config()

const config = {
  environment: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 8000,
  jwt_secret: process.env.JWT_SECRET ?? '',
  redis_url: process.env.REDIS_URL ?? '',
  logger_loki_host: process.env.LOGGER_LOKI_HOST ?? '',
  logger_loki_username: process.env.LOKI_USERNAME ?? '',
  logger_loki_password: process.env.LOKI_PASSWORD ?? '',
  pg_host: process.env.PG_HOST ?? '',
  pg_user: process.env.PG_USER ?? '',
  pg_password: process.env.PG_PASSWORD ?? '',
  pg_database: process.env.PG_DATABASE ?? '',
  pg_port: process.env.PG_PORT ?? 5346,
  sqlite_database: process.env.SQLITE_DATABASE ?? 'hashx.db',
  ipfs_api_url: process.env.IPFS_API_URL ?? 'http://103.194.228.64/api/v0/add'
}

export default config
