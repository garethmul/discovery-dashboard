import mysql from 'mysql2/promise';
import logger from '../src/utils/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const domainId = 5;

// Base MySQL configuration
const baseConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 60000 // 60 seconds timeout
};

// Different SSL configurations to try
const sslConfigs = [
  {
    name: "Default SSL",
    config: {
      ...baseConfig,
      ssl: { rejectUnauthorized: false }
    }
  },
  {
    name: "SSL disabled",
    config: {
      ...baseConfig,
      ssl: false
    }
  },
  {
    name: "SSL with CA verification disabled",
    config: {
      ...baseConfig,
      ssl: {
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined
      }
    }
  }
];

async function createConnection() {
  for (const { name, config } of sslConfigs) {
    try {
      logger.info(`Trying to connect with ${name} configuration`);
      const connection = await mysql.createConnection(config);
      logger.info(`Successfully connected with ${name} configuration`);
      return connection;
    } catch (error) {
      logger.error(`Failed to connect with ${name}: ${error.message}`);
    }
  }
  throw new Error('All connection attempts failed');
}

async function checkBrandfetchData() {
  let connection;
  try {
    logger.info(`Checking Brandfetch data for domain ID: ${domainId}`);
    
    // Create connection
    connection = await createConnection();
    logger.info('Connected to database');
    
    // Get domain name
    const [domainRows] = await connection.execute(
      'SELECT domain FROM domain_info WHERE id = ?',
      [domainId]
    );
    
    if (!domainRows.length) {
      logger.warn(`No domain found for ID: ${domainId}`);
      return;
    }
    
    const domainName = domainRows[0].domain;
    logger.info(`Found domain name: ${domainName}`);
    
    // Get Brandfetch data
    const [brandfetchRows] = await connection.execute(
      'SELECT * FROM brandfetch_data WHERE domain = ?',
      [domainName]
    );
    
    if (!brandfetchRows.length) {
      logger.warn(`No Brandfetch data found for domain: ${domainName}`);
      return;
    }
    
    // Parse the data field if it's a string
    if (brandfetchRows[0].data && typeof brandfetchRows[0].data === 'string') {
      try {
        brandfetchRows[0].data = JSON.parse(brandfetchRows[0].data);
      } catch (parseError) {
        logger.error(`Error parsing Brandfetch data: ${parseError.message}`);
        logger.error('Raw data:', brandfetchRows[0].data);
      }
    }
    
    logger.info('Found Brandfetch data:');
    logger.info(JSON.stringify(brandfetchRows[0], null, 2));
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (error) {
        logger.error(`Error closing connection: ${error.message}`);
      }
    }
    process.exit(0);
  }
}

checkBrandfetchData(); 