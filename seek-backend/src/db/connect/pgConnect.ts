import pkg from 'pg'
import config from '../../config/index.js';
const { Client } = pkg

const dbConfig = {
    user: config.pg_user,
    host: config.pg_host,
    database: config.pg_database,
    password: config.pg_password,
    port: config.pg_port as number
};

const client = new Client(dbConfig);

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

export default client
