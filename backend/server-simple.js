import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 3009;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const httpServer = createServer(app);

// Set up Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Database connection pool
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

// Test database connection
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Make io globally available
global.io = io;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  // Join a job room to receive updates for a specific job
  socket.on('join-job', (jobId) => {
    socket.join(`job-${jobId}`);
    console.log(`Socket ${socket.id} joined room for job ${jobId}`);
  });

  // Leave a job room
  socket.on('leave-job', (jobId) => {
    socket.leave(`job-${jobId}`);
    console.log(`Socket ${socket.id} left room for job ${jobId}`);
  });
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Config endpoint
app.get('/config', (req, res) => {
  res.json({
    scraperApiKey: process.env.API_KEY || 'test-api-key-123'
  });
});

// Health check endpoint
app.get('/health-check', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Alternative health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// API Routes with real database connections
// List all domains
app.get('/domain-data', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    console.log('Received request for domain-data with params:', { search, limit, offset });
    
    // Use domain_info table with correct column names
    let query = 'SELECT di.id, di.domain as domain_name, di.status, di.last_updated as last_scraped_at, di.data FROM domain_info di';
    let params = [];
    
    if (search) {
      query += ' WHERE di.domain LIKE ?';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY di.last_updated DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    
    console.log('Executing SQL query:', query);
    console.log('With parameters:', params);
    
    const [rows] = await pool.query(query, params);
    console.log(`Found ${rows.length} domains in database:`, rows.slice(0, 3));
    
    // Get additional data for each domain
    const domainsWithData = await Promise.all(rows.map(async (domain) => {
      try {
        // Get domain opengraph data
        const [opengraphRows] = await pool.query(
          'SELECT * FROM domain_opengraph WHERE domain_id = ?',
          [domain.id]
        );
        console.log(`Found ${opengraphRows.length} opengraph rows for domain ${domain.id}`);
        
        // Get domain images
        const [imageRows] = await pool.query(
          'SELECT * FROM domain_images WHERE domain_id = ? LIMIT 10',
          [domain.id]
        );
        console.log(`Found ${imageRows.length} image rows for domain ${domain.id}`);
        
        // Parse the JSON data field if it exists
        let metadataFromData = {};
        if (domain.data && typeof domain.data === 'string') {
          try {
            metadataFromData = JSON.parse(domain.data);
          } catch (parseError) {
            console.error(`Error parsing JSON data for domain ${domain.id}:`, parseError);
          }
        } else if (domain.data && typeof domain.data === 'object') {
          metadataFromData = domain.data;
        }
        
        // Delete the data field since we've extracted what we need
        delete domain.data;
        
        return {
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
                all: imageRows || []
              }
            }
          }
        };
      } catch (error) {
        console.error(`Error fetching data for domain ${domain.id}:`, error);
        return domain;
      }
    }));
    
    console.log('Returning domain data to client, first domain sample:', JSON.stringify(domainsWithData[0]).substring(0, 300) + '...');
    res.json(domainsWithData);
  } catch (error) {
    console.error('Error fetching domains:', error);
    console.error('Error details:', error.message, error.stack);
    
    // Fall back to mock data if database query fails
    console.warn('Database query failed, using mock data instead');
    const mockDomains = [
      {
        id: '1',
        domain_name: 'example.com (MOCK DATA)',
        status: 'complete',
        last_scraped_at: new Date(Date.now() - 3600000).toISOString(),
        data: {
          metadata: {
            title: 'Example Domain',
            description: 'This domain is for use in illustrative examples in documents.'
          },
          opengraph: [
            {
              url: 'https://facebook.com/example',
              title: 'Facebook',
              type: 'social_profile',
              platform: 'Facebook'
            },
            {
              url: 'https://twitter.com/example',
              title: 'Twitter',
              type: 'social_profile',
              platform: 'Twitter'
            }
          ]
        }
      },
      {
        id: '2',
        domain_name: 'test-site.org (MOCK DATA)',
        status: 'in_progress',
        last_scraped_at: new Date(Date.now() - 7200000).toISOString(),
        data: {
          metadata: {
            title: 'Test Website',
            description: 'A website for testing purposes'
          }
        }
      },
      {
        id: '3',
        domain_name: 'sample-blog.net (MOCK DATA)',
        status: 'failed',
        last_scraped_at: null,
        data: {
          metadata: {
            title: 'Sample Blog',
            description: 'A blog with sample content'
          },
          opengraph: [
            {
              url: 'https://instagram.com/sample-blog',
              title: 'Instagram',
              type: 'social_profile',
              platform: 'Instagram'
            }
          ]
        }
      }
    ];
    
    res.json(mockDomains);
  }
});

// Get domain details by ID
app.get('/domain-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get basic domain information with correct column names
    const [domainRows] = await pool.query(
      'SELECT di.id, di.domain as domain_name, di.status, di.last_updated as last_scraped_at, di.data FROM domain_info di WHERE di.id = ?',
      [id]
    );
    
    if (domainRows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    const domain = domainRows[0];
    
    // Parse the JSON data field if it exists
    let metadataFromData = {};
    if (domain.data && typeof domain.data === 'string') {
      try {
        metadataFromData = JSON.parse(domain.data);
      } catch (parseError) {
        console.error(`Error parsing JSON data for domain ${domain.id}:`, parseError);
      }
    } else if (domain.data && typeof domain.data === 'object') {
      metadataFromData = domain.data;
    }
    
    // Delete the data field since we've extracted what we need
    delete domain.data;
    
    // Get domain pages
    const [pageRows] = await pool.query(
      'SELECT url, title, status_code as statusCode FROM domain_pages WHERE domain_id = ?',
      [id]
    );
    
    // Get domain opengraph data
    const [opengraphRows] = await pool.query(
      'SELECT url, title, type, og_type as ogType FROM domain_opengraph WHERE domain_id = ?',
      [id]
    );
    
    // Get domain media
    const [mediaRows] = await pool.query(
      'SELECT url, alt_text as alt, type, category FROM domain_images WHERE domain_id = ?',
      [id]
    );
    
    // Combine all data
    const fullDomain = {
      ...domain,
      data: {
        metadata: {
          title: metadataFromData.title || '',
          description: metadataFromData.description || '',
          logoUrl: metadataFromData.logoUrl || ''
        },
        pages: pageRows || [],
        opengraph: opengraphRows || [],
        media: {
          images: {
            all: mediaRows || []
          }
        }
      }
    };
    
    res.json(fullDomain);
  } catch (error) {
    console.error(`Error fetching domain ${req.params.id}:`, error);
    
    // Fall back to mock data if database query fails
    const domain = {
      id: req.params.id,
      domain_name: 'example.com (MOCK DATA)',
      status: 'complete',
      last_scraped_at: new Date().toISOString(),
      data: {
        metadata: {
          title: 'Example Website',
          description: 'This is an example website for demonstration purposes',
          keywords: 'example, demo, test'
        },
        pages: [
          { url: 'https://example.com', title: 'Home Page', statusCode: 200 },
          { url: 'https://example.com/about', title: 'About Us', statusCode: 200 },
          { url: 'https://example.com/contact', title: 'Contact', statusCode: 200 }
        ],
        opengraph: [
          { url: 'https://facebook.com/example', title: 'Facebook', type: 'social_profile', platform: 'Facebook' },
          { url: 'https://twitter.com/example', title: 'Twitter', type: 'social_profile', platform: 'Twitter' }
        ],
        media: {
          images: {
            all: [
              { url: 'https://example.com/logo.png', alt: 'Logo', category: 'Logo' },
              { url: 'https://example.com/banner.jpg', alt: 'Banner', category: 'Banner' }
            ]
          }
        }
      }
    };
    
    res.json(domain);
  }
});

// Legacy API routes - Keep for backward compatibility
// List all jobs
app.get('/api/scrape/jobs', (req, res) => {
  const { status, limit = 20, offset = 0 } = req.query;
  
  // Generate mock jobs
  const mockJobs = [
    {
      jobId: '123e4567-e89b-12d3-a456-426614174000',
      domain: 'example.com',
      status: 'complete',
      progress: 100,
      message: 'Scrape completed successfully',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      startedAt: new Date(Date.now() - 3500000).toISOString(),
      completedAt: new Date(Date.now() - 3000000).toISOString()
    },
    {
      jobId: '223e4567-e89b-12d3-a456-426614174001',
      domain: 'demo-site.org',
      status: 'complete',
      progress: 100,
      message: 'Scrape completed successfully',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      startedAt: new Date(Date.now() - 7100000).toISOString(),
      completedAt: new Date(Date.now() - 7000000).toISOString()
    }
  ];
  
  // Filter by status if provided
  const filteredJobs = status ? mockJobs.filter(job => job.status === status) : mockJobs;
  
  res.json({
    jobs: filteredJobs,
    count: filteredJobs.length,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// Get job results
app.get('/api/scrape/results/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  res.json({
    domain: 'example.com',
    scrapedAt: new Date().toISOString(),
    general: {
      siteStructure: {
        title: 'Example Website',
        meta: {
          description: 'This is an example website for demonstration purposes',
          keywords: 'example, demo, test'
        }
      }
    }
  });
});

// Submit new job
app.post('/api/scrape', (req, res) => {
  const { domain } = req.body;
  
  const jobId = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
  
  // Emit a job update event after a short delay
  setTimeout(() => {
    io.emit('job-update', {
      jobId,
      domain,
      status: 'processing',
      progress: 25,
      message: 'Discovering pages'
    });
    
    // Complete the job after a few seconds
    setTimeout(() => {
      io.emit('job-update', {
        jobId,
        domain,
        status: 'complete',
        progress: 100,
        message: 'Scrape completed successfully'
      });
    }, 5000);
  }, 2000);
  
  res.status(201).json({
    jobId,
    status: 'queued',
    estimatedTime: '30s'
  });
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    // First check database connection
    const connection = await pool.getConnection();
    
    // Get the list of tables
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    // Get record counts for important tables
    const counts = {};
    for (const table of tableNames) {
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = countResult[0].count;
    }
    
    // Check domain_info table structure
    let domainInfoColumns = [];
    if (tableNames.includes('domain_info')) {
      const [columnsResult] = await connection.query('DESCRIBE domain_info');
      domainInfoColumns = columnsResult;
    }
    
    // Check the specific domains info
    let domains = [];
    if (tableNames.includes('domain_info')) {
      const [domainsResult] = await connection.query('SELECT * FROM domain_info LIMIT 1');
      domains = domainsResult;
    }
    
    connection.release();
    
    // Return the database information
    res.json({
      connected: true,
      tables: tableNames,
      recordCounts: counts,
      domainInfoColumns: domainInfoColumns,
      sampleDomain: domains[0]
    });
  } catch (error) {
    console.error('Test database error:', error);
    res.status(500).json({
      connected: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Serve the dashboard for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
(async function startServer() {
  // Test database connection before starting the server
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    console.log('Database connection successful');
  } else {
    console.warn('Database connection failed. Will use mock data for responses.');
  }
  
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Dashboard available at http://localhost:${PORT}`);
  });
})(); 