import mysql from 'mysql2/promise';
import logger from '../src/utils/logger.js';

// Database configuration for MySQL
const mysqlConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.MYSQL_SSL_CA ? { ca: process.env.MYSQL_SSL_CA } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000 // 60 seconds timeout
};

// Create connection pool
let pool;

// Test database connection
const testConnection = async () => {
  try {
    // Log database configuration (without sensitive info)
    logger.info(`Attempting to connect to MySQL database at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    logger.info(`Database configuration: host=${process.env.DB_HOST}, port=${process.env.DB_PORT}, user=${process.env.DB_USER}, database=${process.env.DB_NAME}`);
    
    // Create connection pool
    pool = mysql.createPool(mysqlConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    logger.info('MySQL database connection established successfully');
    
    // Test a simple query
    const [rows] = await connection.query('SHOW TABLES');
    logger.info(`Database tables found: ${rows.length}`);
    logger.info(`Tables: ${rows.map(row => Object.values(row)[0]).join(', ')}`);
    
    // Release the connection
    connection.release();
    
    // Make pool globally available
    global.pool = pool;
    global.dbConnected = true;
    
    return true;
  } catch (error) {
    logger.error(`Failed to connect to MySQL database: ${error.message}`);
    logger.error(`Error code: ${error.code}`);
    logger.error(`Error errno: ${error.errno}`);
    logger.error(`Error sqlState: ${error.sqlState}`);
    logger.error(`Error sqlMessage: ${error.sqlMessage}`);
    logger.error(error.stack);
    
    // Try different connection configurations
    const alternativeConfigs = [
      {
        name: "SSL disabled",
        config: {
          ...mysqlConfig,
          ssl: false
        }
      },
      {
        name: "SSL with rejectUnauthorized: false",
        config: {
          ...mysqlConfig,
          ssl: { rejectUnauthorized: false }
        }
      },
      {
        name: "Direct connection (no pool)",
        config: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: { rejectUnauthorized: false },
          connectTimeout: 60000 // 60 seconds
        }
      }
    ];
    
    // Try each alternative configuration
    for (const { name, config } of alternativeConfigs) {
      try {
        logger.info(`Trying alternative connection with: ${name}`);
        
        if (name === "Direct connection (no pool)") {
          // Create direct connection
          const connection = await mysql.createConnection(config);
          logger.info(`MySQL database connection established successfully with: ${name}`);
          
          // Test a simple query
          const [rows] = await connection.query('SHOW TABLES');
          logger.info(`Database tables found: ${rows.length}`);
          
          // Create a pool with the successful configuration
          pool = mysql.createPool({
            ...config,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
          });
          
          // Close the direct connection
          await connection.end();
        } else {
          // Create connection pool
          pool = mysql.createPool(config);
          
          // Test the connection
          const connection = await pool.getConnection();
          logger.info(`MySQL database connection established successfully with: ${name}`);
          
          // Test a simple query
          const [rows] = await connection.query('SHOW TABLES');
          logger.info(`Database tables found: ${rows.length}`);
          
          // Release the connection
          connection.release();
        }
        
        // Make pool globally available
        global.pool = pool;
        global.dbConnected = true;
        
        return true;
      } catch (altError) {
        logger.error(`Failed to connect to MySQL database with ${name}: ${altError.message}`);
        logger.error(`Error code: ${altError.code}`);
        logger.error(`Error errno: ${altError.errno}`);
        logger.error(`Error sqlState: ${altError.sqlState}`);
        logger.error(`Error sqlMessage: ${altError.sqlMessage}`);
      }
    }
    
    global.dbConnected = false;
    return false;
  }
};

// Get connection pool
const getPool = () => {
  if (!pool) {
    throw new Error('MySQL pool not available');
  }
  return pool;
};

export { testConnection, getPool }; 