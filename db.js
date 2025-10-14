require('dotenv').config(); // Load .env variables
const { Pool } = require('pg');

console.log('Database user is:', process.env.DB_USER);
console.log('Database host is:', process.env.DB_HOST);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
