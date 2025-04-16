import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

/**
 * Get the MySQL connection pool
 * @returns {Promise<mysql.Pool>} MySQL connection pool
 */
export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  
  return pool;
}

/**
 * Check if the database connection is working
 * @returns {Promise<boolean>} True if the database connection is working
 */
export async function checkDatabaseConnection() {
  try {
    const pool = await getPool();
    const connection = await pool.getConnection();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
} 