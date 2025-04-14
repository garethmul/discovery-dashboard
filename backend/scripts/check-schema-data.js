import { getPool } from '../config/database.js';

async function checkSchemaMarkupData() {
  try {
    console.log('Connecting to database...');
    const db = await getPool();
    
    console.log('Checking schema markup data for domain 132...');
    const [rows] = await db.query(`
      SELECT 
        id,
        domain_id,
        page_id,
        url,
        schema_type,
        markup_format,
        created_at
      FROM domain_schema_markup
      WHERE domain_id = 132
      LIMIT 10
    `);
    
    console.log(`Found ${rows.length} schema markup records for domain 132:`);
    console.table(rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema markup data:', error);
    process.exit(1);
  }
}

checkSchemaMarkupData(); 