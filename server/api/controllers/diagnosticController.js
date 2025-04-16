import logger from '../../utils/logger.js';

/**
 * Get the status of the database connection
 * This helps diagnose issues with database connectivity in production
 */
export const getDatabaseStatus = async (req, res) => {
  try {
    logger.info('Diagnostic: Testing database connection');
    
    // Try to execute a simple query
    logger.info('Diagnostic: Executing test query');
    const [rows] = await req.app.locals.pool.execute('SHOW TABLES');
    
    // Log table names but limit the output for security
    const tableCount = rows.length;
    const tableSample = rows.slice(0, 5).map(row => Object.values(row)[0]);
    
    logger.info(`Diagnostic: Database connected successfully. Found ${tableCount} tables.`);
    
    return res.status(200).json({
      status: 'connected',
      message: 'Database connection is working',
      details: {
        tableCount,
        tableSample: tableSample.join(', ') + (tableCount > 5 ? '...' : '')
      }
    });
  } catch (error) {
    logger.error(`Diagnostic: Database connection error: ${error.message}`);
    logger.error(`Diagnostic: Error stack: ${error.stack}`);
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message
    });
  }
};

/**
 * Run a custom SQL query for diagnostic purposes
 * This should only be used in development and testing environments
 */
export const runDiagnosticQuery = async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        status: 'error',
        message: 'Diagnostic queries only allowed in development environment'
      });
    }

    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter is required'
      });
    }

    logger.info('Diagnostic: Executing custom query');
    const [rows] = await req.app.locals.pool.execute(query);
    
    return res.status(200).json({
      status: 'success',
      results: rows
    });
  } catch (error) {
    logger.error(`Diagnostic: Query execution error: ${error.message}`);
    logger.error(`Diagnostic: Error stack: ${error.stack}`);
    
    return res.status(500).json({
      status: 'error',
      message: 'Failed to execute query',
      error: error.message
    });
  }
}; 