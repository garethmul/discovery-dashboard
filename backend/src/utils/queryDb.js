import { getPool } from '../database/db.js';
import logger from './logger.js';

async function main() {
  try {
    const query = process.argv[2];
    if (!query) {
      console.error('Please provide a SQL query as an argument');
      process.exit(1);
    }

    const db = getPool({
      ssl: {
        rejectUnauthorized: false
      }
    });
    const [rows] = await db.query(query);
    
    console.log('Query:', query);
    console.log('Results:', JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main(); 