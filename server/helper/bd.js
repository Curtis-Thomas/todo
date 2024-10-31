import pkg from 'pg';
import dotenv from 'dotenv';

const environment = process.env.NODE_ENV
dotenv.config();

const { Pool } = pkg;

const openDb = () => {
//   console.log("Database connection details:");
//   console.log("DB_USER:", process.env.DB_USER);
//   console.log("DB_HOST:", process.env.DB_HOST);
//   console.log("DB_NAME:", process.env.NODE_ENV === 'development' ? process.env.DB_NAME : process.env.TEST_DB_NAME);
//   console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
//   console.log("DB_PORT:", process.env.DB_PORT);

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: environment === 'development' ? process.env.DB_NAME : process.env.TEST_DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  return pool;
};

const pool = openDb();

export { pool };