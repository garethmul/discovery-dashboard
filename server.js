import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';
import { getDatabaseStatus, runDiagnosticQuery } from './server/api/controllers/diagnosticController.js';
import authMiddleware from './server/middleware/authMiddleware.js';
import passwordMiddleware from './server/middleware/passwordMiddleware.js';
import youtubeRoutes from './backend/src/routes/youtubeRoutes.js';
import externalLinksRoutes from './backend/src/routes/externalLinksRoutes.js';
import booksRoutes from './backend/src/routes/booksRoutes.js';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 3009;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist'); // Changed from 'public' to 'dist'

console.log('Environment PORT:', process.env.PORT);
console.log('Static files directory:', DIST_DIR);

// Create Express app
const app = express();
const httpServer = createServer(app);

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies - needed for password authentication
app.use(cookieParser());

// Apply password middleware for dashboard protection
app.use(passwordMiddleware);

// Serve static files from the frontend build directory
app.use(express.static(DIST_DIR));

// Database connection pool
console.log('Creating database pool with config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    // This will accept any certificate (not secure for production)
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Store pool in app.locals for access in controllers
app.locals.pool = pool;

// Test database connection on startup
(async () => {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('Successfully connected to database');
    connection.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
})();

// Create API router for /api routes
const apiRouter = express.Router();

// Apply authentication middleware to all API routes
apiRouter.use(authMiddleware);

// Mount these routes WITH the /api prefix
// Don't apply authMiddleware again since each router now has it
app.use('/api/youtube', youtubeRoutes);
app.use('/api/external-links', externalLinksRoutes);
app.use('/api/books', booksRoutes);

// Define API routes
// Get domain details by ID
apiRouter.get('/domain-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching domain details for ID: ${id}`);
    
    // Get basic domain information with correct column names - adding screenshot fields
    const query = 'SELECT di.id, di.domain as domain_name, di.status, di.last_updated as last_scraped_at, di.data, di.ai_analysis, di.screenshot_desktop, di.screenshot_mobile, di.screenshot_desktop_full, di.screenshot_mobile_full FROM domain_info di WHERE di.id = ?';
    console.log('Executing query:', query);
    console.log('With parameters:', [id]);
    
    const [domainRows] = await pool.query(query, [id]);
    
    console.log(`Found ${domainRows.length} domain rows for ID ${id}`);
    if (domainRows.length > 0) {
      console.log('Raw domain row:', JSON.stringify(domainRows[0], null, 2));
    }
    
    if (domainRows.length === 0) {
      console.log(`No domain found with ID ${id}`);
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    const domain = domainRows[0];
    console.log('Domain data:', JSON.stringify(domain, null, 2));
    
    // Parse the JSON data field if it exists
    let metadataFromData = {};
    let aiAnalysisData = {};
    
    if (domain.data && typeof domain.data === 'string') {
      try {
        metadataFromData = JSON.parse(domain.data);
        console.log('Parsed metadata:', JSON.stringify(metadataFromData, null, 2));
      } catch (parseError) {
        console.error(`Error parsing JSON data for domain ${domain.id}:`, parseError);
        console.error('Raw data field:', domain.data);
      }
    } else if (domain.data && typeof domain.data === 'object') {
      metadataFromData = domain.data;
      console.log('Using object metadata:', JSON.stringify(metadataFromData, null, 2));
    }
    
    // Parse the AI analysis field if it exists
    console.log('Raw AI analysis field:', domain.ai_analysis);
    if (domain.ai_analysis && typeof domain.ai_analysis === 'string') {
      try {
        aiAnalysisData = JSON.parse(domain.ai_analysis);
        console.log('Parsed AI analysis:', JSON.stringify(aiAnalysisData, null, 2));
      } catch (parseError) {
        console.error(`Error parsing AI analysis for domain ${domain.id}:`, parseError);
        console.error('Raw AI analysis field:', domain.ai_analysis);
      }
    } else if (domain.ai_analysis && typeof domain.ai_analysis === 'object') {
      aiAnalysisData = domain.ai_analysis;
      console.log('Using object AI analysis:', JSON.stringify(aiAnalysisData, null, 2));
    }
    
    // Delete the raw fields since we've extracted what we need
    delete domain.data;
    delete domain.ai_analysis;
    
    // Add screenshot fields to the domain object
    const screenshots = {
      desktop: domain.screenshot_desktop,
      mobile: domain.screenshot_mobile,
      desktopFull: domain.screenshot_desktop_full,
      mobileFull: domain.screenshot_mobile_full
    };
    
    // Remove the original screenshot fields from the domain object
    delete domain.screenshot_desktop;
    delete domain.screenshot_mobile;
    delete domain.screenshot_desktop_full;
    delete domain.screenshot_mobile_full;
    
    // Add the screenshots object to the domain
    domain.screenshots = screenshots;
    
    // Get domain pages with error handling
    let pageRows = [];
    try {
      [pageRows] = await pool.query(
      'SELECT url, title, status_code as statusCode FROM domain_pages WHERE domain_id = ?',
      [id]
    );
    console.log(`Found ${pageRows.length} pages for domain ${id}`);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
    
    // Get domain opengraph data with error handling
    let opengraphRows = [];
    try {
      [opengraphRows] = await pool.query(
      'SELECT url, title, type, platform FROM domain_opengraph WHERE domain_id = ?',
      [id]
    );
    console.log(`Found ${opengraphRows.length} opengraph entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching opengraph data:', error);
    }
    
    // Get domain media with error handling
    let mediaRows = [];
    try {
      [mediaRows] = await pool.query(
      'SELECT url, alt_text as alt, category FROM domain_images WHERE domain_id = ?',
      [id]
    );
    console.log(`Found ${mediaRows.length} media entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching media:', error);
    }

    // Get brand analysis data with error handling
    let brandRows = [];
    try {
      [brandRows] = await pool.query(
        'SELECT * FROM domain_brand_analysis WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${brandRows.length} brand analysis entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching brand analysis:', error);
    }

    // Get Brandfetch data with error handling
    let brandfetchData = null;
    try {
      console.log(`Attempting to fetch Brandfetch data for domain: ${domain.domain_name}`);
      const [brandfetchRows] = await pool.query(
        'SELECT * FROM brandfetch_data WHERE domain = ?',
        [domain.domain_name]
      );
      console.log(`Found ${brandfetchRows.length} brandfetch entries for domain ${domain.domain_name}`);
      
      if (brandfetchRows.length === 0) {
        console.log(`No Brandfetch data found for domain: ${domain.domain_name}`);
      } else {
        console.log('Brandfetch data found:', JSON.stringify(brandfetchRows[0], null, 2));
        brandfetchData = brandfetchRows[0];
      }
      
      // Parse the data field if it's a string
      if (brandfetchData && brandfetchData.data) {
        try {
          if (typeof brandfetchData.data === 'string') {
            brandfetchData.data = JSON.parse(brandfetchData.data);
          }
          console.log('Parsed Brandfetch data:', JSON.stringify(brandfetchData.data, null, 2));
        } catch (parseError) {
          console.error('Error parsing brandfetch data:', parseError);
          console.error('Raw data that failed to parse:', brandfetchData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching brandfetch data:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Get content categories with error handling
    let categoryRows = [];
    try {
      [categoryRows] = await pool.query(
        'SELECT * FROM domain_content_categories WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${categoryRows.length} content category entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching content categories:', error);
    }

    // Get app suggestions with error handling
    let appRows = [];
    try {
      [appRows] = await pool.query(
        'SELECT * FROM domain_app_suggestions WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${appRows.length} app suggestion entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching app suggestions:', error);
    }

    // Get marketing tips with error handling
    let marketingRows = [];
    try {
      [marketingRows] = await pool.query(
        'SELECT * FROM domain_marketing_tips WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${marketingRows.length} marketing tip entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching marketing tips:', error);
    }

    // Get features with error handling
    let featureRows = [];
    try {
      [featureRows] = await pool.query(
        'SELECT * FROM domain_features WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${featureRows.length} feature entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching features:', error);
    }

    // Get color schemes with error handling
    let colorRows = [];
    try {
      [colorRows] = await pool.query(
        'SELECT * FROM domain_color_schemes WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${colorRows.length} color scheme entries for domain ${id}`);
    } catch (error) {
      console.error('Error fetching color schemes:', error);
    }

    // Get ISBN data with error handling
    let isbnData = [];
    let isbnImages = [];
    try {
      [isbnData] = await pool.query(
        'SELECT isbn, isbn_type, page_url, context FROM domain_isbn_data WHERE domain_id = ?',
        [id]
      );
      [isbnImages] = await pool.query(
        'SELECT isbn, image_url, page_url, alt_text FROM domain_isbn_images WHERE domain_id = ?',
        [id]
      );
      console.log(`Found ${isbnData.length} ISBNs and ${isbnImages.length} ISBN images for domain ${id}`);
    } catch (error) {
      console.error('Error fetching ISBN data:', error);
      isbnData = [];
      isbnImages = [];
    }

    // Create books object only if we have data
    const booksData = (isbnData.length > 0 || isbnImages.length > 0) ? {
      isbns: isbnData,
      isbnImages: isbnImages
    } : null;

    // Query podcast feeds
    console.log('Querying podcast feeds for domain ID:', id);
    const [podcastFeeds] = await pool.query(
      'SELECT * FROM domain_podcast_feeds WHERE domain_id = ?',
      [id]
    );
    console.log('Found podcast feeds:', podcastFeeds);

    // Query podcast episodes
    console.log('Querying podcast episodes for domain ID:', id);
    const [podcastEpisodes] = await pool.query(
      'SELECT * FROM domain_podcast_episodes WHERE domain_id = ?',
      [id]
    );
    console.log('Found podcast episodes:', podcastEpisodes);

    // Get schema markup data for the domain
    console.log('Executing schema markup query for domain ID:', id);
    const schemaMarkupQuery = `
      SELECT 
        id,
        domain_id,
        page_id,
        url,
        schema_type,
        schema_context,
        markup_format,
        markup_data,
        parent_type,
        created_at
      FROM domain_schema_markup
      WHERE domain_id = ?
    `;
    console.log('Schema markup query:', schemaMarkupQuery);
    
    try {
      const [schemaMarkupRows] = await pool.query(schemaMarkupQuery, [id]);
      console.log('Found schema markup rows:', schemaMarkupRows.length);
      console.log('Sample schema markup row:', schemaMarkupRows.length > 0 ? JSON.stringify(schemaMarkupRows[0]) : 'No rows found');
      
      // Transform schema markup data to a client-friendly format
      const schemaMarkup = schemaMarkupRows.map(row => {
        // Parse JSON fields only if they are strings
        let parsedMarkupData = null;
        let parsedSchemaContext = null;

        try {
          if (row.markup_data && typeof row.markup_data === 'string') {
            parsedMarkupData = JSON.parse(row.markup_data);
          } else if (row.markup_data && typeof row.markup_data === 'object') {
            parsedMarkupData = row.markup_data;
          }
        } catch (error) {
          console.error('Error parsing markup_data:', error);
          parsedMarkupData = null;
        }

        try {
          if (row.schema_context && typeof row.schema_context === 'string') {
            parsedSchemaContext = JSON.parse(row.schema_context);
          } else if (row.schema_context && typeof row.schema_context === 'object') {
            parsedSchemaContext = row.schema_context;
          }
        } catch (error) {
          console.error('Error parsing schema_context:', error);
          parsedSchemaContext = null;
        }

        return {
          id: row.id,
          pageId: row.page_id,
          pageUrl: row.url,
          schemaType: row.schema_type,
          markupFormat: row.markup_format,
          markupData: parsedMarkupData,
          schemaContext: parsedSchemaContext,
          parentType: row.parent_type,
          createdAt: row.created_at
        };
      });
      
      console.log('Transformed schema markup:', schemaMarkup.length);
      
      // Combine all the data into a single response
      const response = {
        ...domain,
        data: {
          metadata: {
            title: metadataFromData.title || '',
            description: metadataFromData.description || '',
            logoUrl: metadataFromData.logoUrl || ''
          },
          opengraph: opengraphRows || [],
          media: {
            images: {
              all: mediaRows || []
            }
          },
          pages: pageRows || [],
          schemaMarkup: schemaMarkup || [],
          aiAnalysis: {
            ...aiAnalysisData,
            brandAnalysis: brandRows.length > 0 ? brandRows[0] : null,
            contentCategories: categoryRows || [],
            appSuggestions: appRows || [],
            marketingTips: marketingRows || [],
            features: featureRows || [],
            colorSchemes: colorRows || []
          },
          brandfetch: brandfetchData,
          podcasts: {
            feeds: podcastFeeds || [],
            episodes: podcastEpisodes || []
          },
          books: booksData
        }
      };

      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.json(response);
    } catch (error) {
      console.error('Error fetching schema markup:', error);
      
      // Combine all the data into a single response without schema markup
      const response = {
        ...domain,
        data: {
          metadata: {
            title: metadataFromData.title || '',
            description: metadataFromData.description || '',
            logoUrl: metadataFromData.logoUrl || ''
          },
          opengraph: opengraphRows || [],
          media: {
            images: {
              all: mediaRows || []
            }
          },
          pages: pageRows || [],
          schemaMarkup: [], // Empty schema markup on error
          aiAnalysis: {
            ...aiAnalysisData,
            brandAnalysis: brandRows.length > 0 ? brandRows[0] : null,
            contentCategories: categoryRows || [],
            appSuggestions: appRows || [],
            marketingTips: marketingRows || [],
            features: featureRows || [],
            colorSchemes: colorRows || []
          },
          brandfetch: brandfetchData,
          podcasts: {
            feeds: podcastFeeds || [],
            episodes: podcastEpisodes || []
          },
          books: booksData
        }
      };

      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.json(response);
    }
  } catch (error) {
    console.error('Error fetching domain data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all domains with pagination and filtering
apiRouter.get('/domain-data', async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 25;
    const sortBy = req.query.sortBy || 'domain_name';
    const sortOrder = (req.query.sortOrder || 'asc').toUpperCase();
    const search = req.query.search || '';
    
    console.log(`Fetching domains with pagination: page=${page}, limit=${limit}, sortBy=${sortBy}, sortOrder=${sortOrder}, search=${search}`);
    
    // Validate sort column to prevent SQL injection
    const validColumns = ['id', 'domain_name', 'status', 'last_scraped_at'];
    const orderByColumn = validColumns.includes(sortBy) ? sortBy : 'domain_name';
    
    // Validate sort direction
    const orderDirection = sortOrder === 'DESC' ? 'DESC' : 'ASC';
    
    // Calculate offset
    const offset = page * limit;
    
    // Build the search condition if search term is provided
    let searchCondition = '';
    let queryParams = [];
    
    if (search) {
      searchCondition = 'WHERE di.domain LIKE ?';
      queryParams.push(`%${search}%`);
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM domain_info di ${searchCondition}`;
    console.log('Executing count query:', countQuery);
    console.log('With parameters:', queryParams);
    
    const [countResult] = await pool.query(countQuery, queryParams);
    const total = countResult[0].total;
    
    // Get domain data with pagination and sorting
    const query = `
      SELECT di.id, di.domain as domain_name, di.status, di.last_updated as last_scraped_at,
             (SELECT COUNT(*) FROM domain_pages dp WHERE dp.domain_id = di.id) as page_count
      FROM domain_info di 
      ${searchCondition}
      ORDER BY ${orderByColumn} ${orderDirection} 
      LIMIT ? OFFSET ?
    `;
    
    // Add limit and offset to query parameters
    queryParams.push(limit, offset);
    
    console.log('Executing query:', query);
    console.log('With parameters:', queryParams);
    
    const [domainRows] = await pool.query(query, queryParams);
    
    console.log(`Found ${domainRows.length} domains out of ${total} total`);
    if (domainRows.length > 0) {
      console.log('First domain row:', JSON.stringify(domainRows[0], null, 2));
    }

    // Return domains with pagination metadata
    res.json({
      domains: domainRows,
      totalCount: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get SEO data for a domain
apiRouter.get('/seo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching SEO data for domain ID: ${id}`);
    
    // Get basic domain information first to verify the domain exists
    const [domainRows] = await pool.query(
      'SELECT id, domain as domain_name FROM domain_info WHERE id = ?',
      [id]
    );
    
    if (domainRows.length === 0) {
      console.log(`No domain found with ID ${id}`);
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    const domain = domainRows[0];
    
    // Get SEO ranked keywords data
    let keywordRows = [];
    try {
      [keywordRows] = await pool.query(
        `SELECT 
          ranked_keyword_id,
          keyword,
          position,
          previous_position,
          search_volume,
          cpc,
          competition,
          url,
          retrieval_date
        FROM domain_ranked_keywords 
        WHERE domain_id = ?
        ORDER BY position ASC`,
        [id]
      );
      console.log(`Found ${keywordRows.length} ranked keywords for domain ${id}`);
    } catch (error) {
      console.error('Error fetching ranked keywords:', error);
      // If table doesn't exist or other error, continue with empty array
      console.log('Continuing with empty keywords array');
    }
    
    // Calculate statistics
    const totalKeywords = keywordRows.length;
    const top3Count = keywordRows.filter(k => k.position <= 3).length;
    const top10Count = keywordRows.filter(k => k.position <= 10).length;
    const top20Count = keywordRows.filter(k => k.position <= 20).length;
    const top50Count = keywordRows.filter(k => k.position <= 50).length;
    const below50Count = keywordRows.filter(k => k.position > 50).length;
    
    // Calculate average position
    const averagePosition = totalKeywords > 0
      ? keywordRows.reduce((sum, k) => sum + k.position, 0) / totalKeywords
      : 0;
    
    // Calculate most valuable keywords (search volume * cpc)
    const valuableKeywords = keywordRows
      .map(k => ({
        ...k,
        estimated_value: (k.search_volume || 0) * (parseFloat(k.cpc) || 0) / 1000
      }))
      .sort((a, b) => b.estimated_value - a.estimated_value)
      .slice(0, 10);
    
    // Prepare the response
    const response = {
      domain_id: id,
      domain: domain.domain_name,
      statistics: {
        total_keywords: totalKeywords,
        average_position: averagePosition,
        top3_count: top3Count,
        top10_count: top10Count,
        top20_count: top20Count,
        top50_count: top50Count,
        below50_count: below50Count
      },
      keywords: keywordRows,
      most_valuable_keywords: valuableKeywords,
      pagination: {
        total: totalKeywords,
        limit: totalKeywords,
        offset: 0,
        has_more: false
      }
    };
    
    console.log(`Sending SEO data response with ${totalKeywords} keywords`);
    res.json(response);
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
apiRouter.get('/health-check', async (req, res) => {
  try {
    console.log('Health check requested, testing database connection...');
    // Check database connection
    let dbStatus = { status: 'unknown' };
    try {
      // Try to execute a simple query to check database connection
      console.log('Executing test query...');
      const [rows] = await pool.query('SELECT 1');
      console.log('Database test query successful:', rows);
      dbStatus = {
        status: 'connected',
        message: 'Database connection is working',
        test_result: rows
      };
    } catch (dbError) {
      console.error('Database health check error:', dbError);
      dbStatus = {
        status: 'error',
        message: 'Database connection failed',
        error: dbError.message
      };
    }
    
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    };
    console.log('Health check response:', response);
    res.json(response);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get SEO competitor data for a domain
apiRouter.get('/seo-competitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching SEO competitor data for domain ID: ${id}`);
    
    // Get basic domain information first to verify the domain exists
    const [domainRows] = await pool.query(
      'SELECT id, domain as domain_name FROM domain_info WHERE id = ?',
      [id]
    );
    
    if (domainRows.length === 0) {
      console.log(`No domain found with ID ${id}`);
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    const domain = domainRows[0];
    
    // Get SEO competitor snapshot information
    let competitorSnapshotRows = [];
    try {
      [competitorSnapshotRows] = await pool.query(
        `SELECT 
          competitor_id,
          total_count,
          items_count,
          retrieval_date
        FROM domain_seo_competitors
        WHERE domain_id = ?
        ORDER BY retrieval_date DESC
        LIMIT 1`,
        [id]
      );
      console.log(`Found ${competitorSnapshotRows.length} competitor snapshots for domain ${id}`);
    } catch (error) {
      console.error('Error fetching competitor snapshots:', error);
      // If table doesn't exist or other error, continue with empty array
      console.log('Continuing with empty competitor snapshots array');
    }
    
    if (competitorSnapshotRows.length === 0) {
      // No competitor data found
      return res.json({
        domain_id: id,
        domain: domain.domain_name,
        competitors: [],
        stats: {
          total_competitors: 0,
          total_etv: 0,
          total_intersections: 0,
          avg_competitor_intersection: 0
        },
        pagination: {
          total: 0,
          limit: 0,
          offset: 0,
          has_more: false
        }
      });
    }
    
    const competitorSnapshot = competitorSnapshotRows[0];
    
    // Get competitor domains
    let competitorDomainRows = [];
    try {
      [competitorDomainRows] = await pool.query(
        `SELECT 
          competitor_domain_id,
          domain_name,
          avg_position,
          sum_position,
          intersections,
          raw_data
        FROM domain_seo_competitor_domains
        WHERE competitor_id = ?
        ORDER BY intersections DESC`,
        [competitorSnapshot.competitor_id]
      );
      console.log(`Found ${competitorDomainRows.length} competitor domains for snapshot ${competitorSnapshot.competitor_id}`);
    } catch (error) {
      console.error('Error fetching competitor domains:', error);
      // If table doesn't exist or other error, continue with empty array
      console.log('Continuing with empty competitor domains array');
    }
    
    // Get competitor metrics for each domain
    const competitors = await Promise.all(competitorDomainRows.map(async (domain) => {
      let metricsRows = [];
      try {
        [metricsRows] = await pool.query(
          `SELECT 
            metric_id,
            metric_type,
            pos_1,
            pos_2_3,
            pos_4_10,
            pos_11_20,
            pos_21_30,
            pos_31_40,
            pos_41_50,
            pos_51_60,
            pos_61_70,
            pos_71_80,
            pos_81_90,
            pos_91_100,
            etv,
            impressions_etv,
            count,
            estimated_paid_traffic_cost,
            is_new,
            is_up,
            is_down,
            is_lost
          FROM domain_seo_competitor_metrics
          WHERE competitor_domain_id = ?`,
          [domain.competitor_domain_id]
        );
        console.log(`Found ${metricsRows.length} metric rows for competitor domain ${domain.competitor_domain_id}`);
      } catch (error) {
        console.error('Error fetching competitor metrics:', error);
        // If table doesn't exist or other error, continue with empty array
        console.log('Continuing with empty metrics array');
      }
      
      // Group metrics by type
      const metrics = {};
      metricsRows.forEach(metric => {
        metrics[metric.metric_type] = {
          pos_1: metric.pos_1,
          pos_2_3: metric.pos_2_3,
          pos_4_10: metric.pos_4_10,
          pos_11_20: metric.pos_11_20,
          pos_21_30: metric.pos_21_30,
          pos_31_40: metric.pos_31_40,
          pos_41_50: metric.pos_41_50,
          pos_51_60: metric.pos_51_60,
          pos_61_70: metric.pos_61_70,
          pos_71_80: metric.pos_71_80,
          pos_81_90: metric.pos_81_90,
          pos_91_100: metric.pos_91_100,
          etv: metric.etv,
          impressions_etv: metric.impressions_etv,
          count: metric.count,
          estimated_paid_traffic_cost: metric.estimated_paid_traffic_cost,
          is_new: metric.is_new,
          is_up: metric.is_up,
          is_down: metric.is_down,
          is_lost: metric.is_lost
        };
      });
      
      return {
        ...domain,
        metrics
      };
    }));
    
    // Calculate summary statistics
    const totalEtv = competitors.reduce((sum, comp) => 
      sum + (comp.metrics?.metrics_organic?.etv || 0), 0);
    const totalIntersections = competitors.reduce((sum, comp) => 
      sum + comp.intersections, 0);
    const avgIntersection = competitors.length > 0 
      ? Math.round(totalIntersections / competitors.length) 
      : 0;
    
    // Prepare response
    const response = {
      domain_id: id,
      domain: domain.domain_name,
      competitors,
      stats: {
        total_competitors: competitorSnapshot.total_count || competitors.length,
        total_etv: totalEtv,
        total_intersections: totalIntersections,
        avg_competitor_intersection: avgIntersection
      },
      pagination: {
        total: competitors.length,
        limit: competitors.length,
        offset: 0,
        has_more: false
      }
    };
    
    console.log(`Sending SEO competitor response with ${competitors.length} competitors`);
    res.json(response);
  } catch (error) {
    console.error('Error fetching SEO competitor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Then mount the API router with authentication for all other /api routes
app.use('/api', apiRouter);

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Start the server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}); 