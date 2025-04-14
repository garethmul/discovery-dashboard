import { getPool } from '../database/db.js';
import logger from './logger.js';

/**
 * Utility to run database queries and display results
 * @param {string} query - SQL query to execute
 * @param {Array} params - Query parameters
 */
export const runQuery = async (query, params = []) => {
  try {
    const db = getPool();
    const [rows] = await db.query(query, params);
    
    logger.info('Query:', query);
    logger.info('Parameters:', params);
    logger.info('Results:', JSON.stringify(rows, null, 2));
    
    return rows;
  } catch (error) {
    logger.error(`Database query error: ${error.message}`);
    logger.error('Query:', query);
    logger.error('Parameters:', params);
    throw error;
  }
};

/**
 * Get Brandfetch data for a domain ID
 * @param {number} domainId - The domain ID
 */
export const getBrandfetchData = async (domainId) => {
  try {
    // First get the domain name
    const domainRows = await runQuery(
      'SELECT domain FROM domain_info WHERE id = ?',
      [domainId]
    );
    
    if (!domainRows.length) {
      logger.warn(`No domain found for ID: ${domainId}`);
      return null;
    }
    
    const domainName = domainRows[0].domain;
    logger.info(`Found domain name: ${domainName}`);
    
    // Get Brandfetch data
    const brandfetchRows = await runQuery(
      'SELECT * FROM brandfetch_data WHERE domain = ?',
      [domainName]
    );
    
    if (!brandfetchRows.length) {
      logger.warn(`No Brandfetch data found for domain: ${domainName}`);
      return null;
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
    
    return brandfetchRows[0];
  } catch (error) {
    logger.error(`Error getting Brandfetch data: ${error.message}`);
    throw error;
  }
}; 