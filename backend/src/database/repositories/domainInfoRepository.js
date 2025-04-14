import { getPool } from '../db.js';
import logger from '../../utils/logger.js';

/**
 * Finds domain info by ID.
 * @param {number} id - The domain_info ID.
 * @returns {Promise<object|null>} - The domain info object or null if not found.
 */
export const findById = async (id) => {
  const db = await getPool();
  try {
    // Assuming the main table is called 'domain_info' and contains 'id', 'domain_name', 'last_scraped_at', 'status'
    const [rows] = await db.query('SELECT * FROM domain_info WHERE id = ?', [id]);
    return rows[0]; // Return the first row found or undefined
  } catch (error) {
     if (error.code === 'ER_NO_SUCH_TABLE') {
       logger.warn(`domain_info table missing for ID ${id}: ${error.message}`);
       return null; // Return null gracefully if table doesn't exist
     }
    logger.error(`Error fetching domain_info for ID ${id}: ${error.message}`, error);
    throw error;
  }
};

/**
 * Finds domain info by domain name.
 * @param {string} domainName - The domain name.
 * @returns {Promise<object|null>} - The domain info object or null if not found.
 */
export const findByDomainName = async (domainName) => {
  const db = await getPool();
  try {
    const [rows] = await db.query('SELECT * FROM domain_info WHERE domain_name = ?', [domainName]);
    return rows[0];
  } catch (error) {
     if (error.code === 'ER_NO_SUCH_TABLE') {
       logger.warn(`domain_info table missing when searching for ${domainName}: ${error.message}`);
       return null;
     }
    logger.error(`Error fetching domain_info for domain name ${domainName}: ${error.message}`, error);
    throw error;
  }
};

/**
 * Finds all domains in the database.
 * @param {Object} options - Options for filtering, sorting and pagination
 * @param {number} options.page - The page number (starting from 0)
 * @param {number} options.limit - Number of records per page
 * @param {string} options.sortBy - Column to sort by
 * @param {string} options.sortOrder - Sort direction ('asc' or 'desc')
 * @returns {Promise<Object>} - Object containing domain info objects and total count
 */
export const findAll = async (options = {}) => {
  const db = await getPool();
  try {
    // Default values
    const page = options.page || 0;
    const limit = options.limit || 25;
    const sortBy = options.sortBy || 'domain_name';
    const sortOrder = options.sortOrder || 'asc';
    
    // Calculate offset
    const offset = page * limit;
    
    // Validate sort column to prevent SQL injection
    const validColumns = ['id', 'domain_name', 'last_scraped_at', 'status'];
    const orderByColumn = validColumns.includes(sortBy) ? sortBy : 'domain_name';
    
    // Validate sort direction
    const orderDirection = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    // Get total count
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM domain_info');
    const total = countResult[0].total;
    
    // Get paginated results
    const [rows] = await db.query(
      `SELECT id, domain_name, last_scraped_at, status FROM domain_info 
       ORDER BY ${orderByColumn} ${orderDirection} 
       LIMIT ? OFFSET ?`, 
      [limit, offset]
    );
    
    return {
      domains: rows,
      totalCount: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      logger.warn(`domain_info table missing when trying to list all domains: ${error.message}`);
      return { domains: [], totalCount: 0, page: 0, limit: 25, totalPages: 0 }; // Return empty result if table doesn't exist
    }
    logger.error(`Error fetching all domain_info records: ${error.message}`, error);
    throw error;
  }
};


// Add other necessary functions (create, update status, etc.) 