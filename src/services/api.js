import axios from 'axios';

// Mock data to use when API is not available
const MOCK_DOMAINS = [
  {
    domainId: '1',
    domainName: 'example.com',
    status: 'complete',
    lastScraped: '2023-10-15T14:30:00Z',
    metadata: {
      title: 'Example Domain',
      description: 'This domain is for use in illustrative examples in documents.',
      logoUrl: 'https://example.com/logo.png',
      themeColor: '#4285f4'
    },
    crawlProgress: {
      pagesTotal: 15,
      pagesCrawled: 15,
      status: 'complete'
    },
    pages: Array(15).fill(null).map((_, i) => ({
      url: `https://example.com/page-${i+1}`,
      title: `Page ${i+1} | Example Domain`,
      statusCode: 200
    })),
    podcasts: {
      feeds: [
        {
          feedUrl: 'https://example.com/podcast/feed.xml',
          title: 'Example Podcast',
          description: 'A podcast about examples',
          feedType: 'rss',
          episodeCount: 5
        }
      ],
      episodes: Array(5).fill(null).map((_, i) => ({
        title: `Episode ${i+1}`,
        description: `This is episode ${i+1} of our example podcast`,
        audioUrl: `https://example.com/podcast/episode-${i+1}.mp3`,
        publishedDate: new Date(2023, 9, 15 - i).toISOString(),
        duration: '25:30'
      }))
    },
    opengraph: [
      {
        url: 'https://facebook.com/example',
        title: 'Facebook',
        type: 'social_profile',
        platform: 'Facebook',
        isSocialProfile: true
      },
      {
        url: 'https://twitter.com/example',
        title: 'Twitter',
        type: 'social_profile',
        platform: 'Twitter',
        isSocialProfile: true
      }
    ],
    media: {
      images: {
        all: [
          // Logo images
          {
            url: 'https://placehold.co/600x200/4285f4/ffffff?text=Example+Logo',
            alt: 'Example Company Logo',
            width: 600,
            height: 200,
            category: 'Logo',
            confidence: 0.95
          },
          {
            url: 'https://placehold.co/400x400/4285f4/ffffff?text=Example+Icon',
            alt: 'Example Company Icon',
            width: 400,
            height: 400,
            category: 'Logo',
            confidence: 0.87
          },
          // Hero images
          {
            url: 'https://placehold.co/1200x600/228B22/ffffff?text=Hero+Banner',
            alt: 'Homepage Hero Banner',
            width: 1200,
            height: 600,
            category: 'Hero'
          },
          {
            url: 'https://placehold.co/1200x600/8A2BE2/ffffff?text=Services+Banner',
            alt: 'Services Page Hero',
            width: 1200,
            height: 600,
            category: 'Hero'
          },
          // Banner images
          {
            url: 'https://placehold.co/960x180/FF4500/ffffff?text=Promotion+Banner',
            alt: 'Special Promotion Banner',
            width: 960,
            height: 180,
            category: 'Banner'
          },
          // Team images
          {
            url: 'https://placehold.co/300x400/000000/ffffff?text=CEO',
            alt: 'CEO Portrait',
            width: 300,
            height: 400,
            category: 'Team'
          },
          {
            url: 'https://placehold.co/300x400/000000/ffffff?text=CTO',
            alt: 'CTO Portrait',
            width: 300,
            height: 400,
            category: 'Team'
          },
          {
            url: 'https://placehold.co/300x400/000000/ffffff?text=CFO',
            alt: 'CFO Portrait',
            width: 300,
            height: 400,
            category: 'Team'
          },
          // Product images
          {
            url: 'https://placehold.co/500x500/1E90FF/ffffff?text=Product+1',
            alt: 'Product 1',
            width: 500,
            height: 500,
            category: 'Product'
          },
          {
            url: 'https://placehold.co/500x500/1E90FF/ffffff?text=Product+2',
            alt: 'Product 2',
            width: 500,
            height: 500,
            category: 'Product'
          }
        ],
        // Also provide categorized image arrays for different access patterns
        logoImages: [
          {
            url: 'https://placehold.co/600x200/4285f4/ffffff?text=Example+Logo',
            alt: 'Example Company Logo',
            width: 600,
            height: 200,
            category: 'Logo',
            confidence: 0.95
          },
          {
            url: 'https://placehold.co/400x400/4285f4/ffffff?text=Example+Icon',
            alt: 'Example Company Icon',
            width: 400,
            height: 400,
            category: 'Logo',
            confidence: 0.87
          }
        ],
        heroImages: [
          {
            url: 'https://placehold.co/1200x600/228B22/ffffff?text=Hero+Banner',
            alt: 'Homepage Hero Banner',
            width: 1200,
            height: 600,
            category: 'Hero'
          },
          {
            url: 'https://placehold.co/1200x600/8A2BE2/ffffff?text=Services+Banner',
            alt: 'Services Page Hero',
            width: 1200,
            height: 600,
            category: 'Hero'
          }
        ],
        bannerImages: [
          {
            url: 'https://placehold.co/960x180/FF4500/ffffff?text=Promotion+Banner',
            alt: 'Special Promotion Banner',
            width: 960,
            height: 180,
            category: 'Banner'
          }
        ],
        teamImages: [
          {
            url: 'https://placehold.co/300x400/000000/ffffff?text=CEO',
            alt: 'CEO Portrait',
            width: 300,
            height: 400,
            category: 'Team'
          },
          {
            url: 'https://placehold.co/300x400/000000/ffffff?text=CTO',
            alt: 'CTO Portrait',
            width: 300,
            height: 400,
            category: 'Team'
          },
          {
            url: 'https://placehold.co/300x400/000000/ffffff?text=CFO',
            alt: 'CFO Portrait',
            width: 300,
            height: 400,
            category: 'Team'
          }
        ],
        productImages: [
          {
            url: 'https://placehold.co/500x500/1E90FF/ffffff?text=Product+1',
            alt: 'Product 1',
            width: 500,
            height: 500,
            category: 'Product'
          },
          {
            url: 'https://placehold.co/500x500/1E90FF/ffffff?text=Product+2',
            alt: 'Product 2',
            width: 500,
            height: 500,
            category: 'Product'
          }
        ]
      }
    }
  },
  {
    domainId: '2',
    domainName: 'test-site.org',
    status: 'in_progress',
    lastScraped: '2023-10-14T10:20:00Z',
    metadata: {
      title: 'Test Website',
      description: 'A website for testing purposes',
      logoUrl: 'https://test-site.org/logo.png'
    },
    crawlProgress: {
      pagesTotal: 8,
      pagesCrawled: 3,
      status: 'in_progress'
    },
    pages: Array(3).fill(null).map((_, i) => ({
      url: `https://test-site.org/page-${i+1}`,
      title: `Page ${i+1} | Test Website`,
      statusCode: 200
    }))
  },
  {
    domainId: '3',
    domainName: 'sample-blog.net',
    status: 'failed',
    lastScraped: null,
    metadata: {
      title: 'Sample Blog',
      description: 'A blog with sample content'
    },
    crawlProgress: {
      pagesTotal: 0,
      pagesCrawled: 0,
      status: 'failed'
    },
    opengraph: [
      {
        url: 'https://instagram.com/sample-blog',
        title: 'Instagram',
        type: 'social_profile',
        platform: 'Instagram',
        isSocialProfile: true
      }
    ]
  }
];

// Flag to track API availability
let isApiAvailable = true;

// API base URL might be different in production vs development
const apiBaseUrl = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Test API availability immediately
(async function checkApiAvailability() {
  try {
    // Get the API key for auth
    const apiKey = localStorage.getItem('apiToken');
    const authConfig = apiKey ? {
      headers: {
        'X-API-Key': apiKey,
        'Authorization': `Bearer ${apiKey}`
      },
      params: {
        apiKey: apiKey
      }
    } : {};
    
    // Try multiple potential endpoints for health check
    try {
      await api.get('/health-check', authConfig);
      console.log('API is available via /health-check');
      isApiAvailable = true;
      return;
    } catch (e) {
      console.log('Health check endpoint not available, trying alternatives...', e.message);
    }
    
    try {
      await api.get('/domain-data?limit=1', authConfig);
      console.log('API is available via /domain-data');
      isApiAvailable = true;
      return;
    } catch (e) {
      console.log('Domain data endpoint not available, falling back to mock data', e.message);
    }
    
    // If we reach here, all health check attempts failed
    isApiAvailable = false;
  } catch (error) {
    console.warn('API does not appear to be available:', error.message);
    isApiAvailable = false;
  }
  
  // Try API again after 30 seconds
  setTimeout(checkApiAvailability, 30000);
})();

// Add request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('apiToken');
    if (token) {
      // Add API key to headers in multiple formats for compatibility
      config.headers['X-API-Key'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Add as query parameter if not already in URL
      if (config.url.indexOf('?') === -1) {
        config.url = `${config.url}?apiKey=${token}`;
      } else {
        config.url = `${config.url}&apiKey=${token}`;
      }
      
      console.log('Added API key to request:', config.url);
    } else {
      console.warn('No API key found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling and response logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`API Response [${response.config.method.toUpperCase()} ${response.config.url}]:`, {
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      dataPreview: Array.isArray(response.data) 
        ? `Array with ${response.data.length} items` 
        : (typeof response.data === 'object' ? Object.keys(response.data) : 'Primitive value')
    });
    
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        config: {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        }
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response Error:', {
        request: error.request,
        config: {
          url: error.config.url,
          method: error.config.method
        }
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get a list of all domains with optional filtering
 * @param {string} search - Optional search term
 * @returns {Promise<Array>} Array of domain objects
 */
export const getDomains = async (search) => {
  // If API is unavailable, return mock data immediately
  if (!isApiAvailable) {
    console.warn('API is unavailable, using mock data');
    if (search) {
      return MOCK_DOMAINS.filter(domain => 
        domain.domainName?.toLowerCase().includes(search.toLowerCase()) ||
        domain.domain?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return MOCK_DOMAINS;
  }

  try {
    const params = {};
    if (search) params.search = search;
    
    // Log the API key being used
    console.log('Current API key:', localStorage.getItem('apiToken'));
    
    const response = await api.get('/domain-data', { params });
    
    // Add additional data transformation and validation
    if (Array.isArray(response.data)) {
      console.log('Domain data structure example:', response.data.length > 0 ? response.data[0] : 'No domains returned');
      // Normalize domain data
      return normalizeDomainData(response.data);
    } else if (response.data && typeof response.data === 'object') {
      // If the API returns an object with domains inside another property
      const possibleArrayKeys = ['domains', 'data', 'items', 'results'];
      for (const key of possibleArrayKeys) {
        if (Array.isArray(response.data[key])) {
          console.log(`Found domains array in response.data.${key}`);
          // Normalize domain data
          return normalizeDomainData(response.data[key]);
        }
      }
      // If we have an object but not in expected format, log and return as is
      console.warn('Unexpected domains response format:', response.data);
      return normalizeDomainData([response.data]);
    }
    
    return normalizeDomainData(response.data);
  } catch (error) {
    console.error('Error fetching domains:', error);
    // Return mock data if API fails
    console.warn('Using mock domain data due to API error');
    if (search) {
      return MOCK_DOMAINS.filter(domain => 
        domain.domainName?.toLowerCase().includes(search.toLowerCase()) ||
        domain.domain?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return MOCK_DOMAINS;
  }
};

/**
 * Normalize domain data to ensure consistent structure
 * @param {Array} domains - Array of domain objects
 * @returns {Array} Normalized domain objects
 */
const normalizeDomainData = (domains) => {
  if (!Array.isArray(domains)) {
    console.warn('Expected domains to be an array, got:', typeof domains);
    return MOCK_DOMAINS;
  }
  
  if (domains.length === 0) {
    return [];
  }
  
  console.log('Normalizing domain data:', domains.length, 'domains');
  
  // Check the format of the first domain to determine the source format
  const sampleDomain = domains[0];
  console.log('Sample domain for format detection:', sampleDomain);
  
  // Detect if we have the API format with domain_name
  const isApiFormat = sampleDomain.domain_name && sampleDomain.id;
  
  if (isApiFormat) {
    console.log('Detected API server format with domain_name field');
    return domains.map(domain => {
      // Determine status based on last_scraped_at
      let status = 'pending';
      if (domain.last_scraped_at) {
        status = 'complete';
      }
      
      return {
        domainId: domain.id.toString(),
        domainName: domain.domain_name,
        status: domain.status || status,
        lastScraped: domain.last_scraped_at,
        crawlProgress: {
          pagesTotal: domain.page_count || 0,
          pagesCrawled: domain.pages_crawled || 0,
          status: domain.status || status
        },
        // Add a flag to indicate this is from the API with limited data
        isFromApi: true
      };
    });
  }
  
  // Fall back to the original normalization for other formats
  return domains.map(domain => {
    // Check if we need to normalize this domain
    const domainName = domain.domainName || domain.domain || domain.url || domain.name;
    if (!domainName) {
      console.warn('Domain missing name, falling back to mock data:', domain);
      return MOCK_DOMAINS[0];
    }
    
    // Basic normalization to ensure key properties exist
    return {
      ...domain,
      // Ensure we have consistent properties for all domains
      domainId: domain.domainId || domain.id || domain._id,
      domainName: domainName,
      status: domain.status || domain.crawlProgress?.status || domain.crawl_status || 'unknown',
      lastScraped: domain.lastScraped || domain.lastCrawled || domain.crawlProgress?.lastActive || domain.last_crawled,
      crawlProgress: domain.crawlProgress || {
        pagesTotal: domain.page_count || domain.pages?.length || 0,
        pagesCrawled: domain.pages_crawled || domain.crawlProgress?.pagesCrawled || 0,
        status: domain.status || domain.crawl_status || 'unknown'
      }
    };
  });
};

/**
 * Get a specific domain by ID
 * @param {string} id - Domain ID
 * @returns {Promise<Object>} Domain object with all details
 */
export const getDomainById = async (id) => {
  try {
    const response = await api.get(`/domain-data/${id}`);
    console.log(`Domain data response for ID ${id}:`, response.data);
    
    // Handle different response formats
    let domainData = response.data;
    
    // If we have a nested data object, merge it with the top-level data
    if (domainData.data && typeof domainData.data === 'object') {
      console.log('Found domain object in response.data.data');
      domainData = {
        ...domainData,
        ...domainData.data,
        // Preserve the original top-level fields
        id: domainData.id,
        domain_name: domainData.domain_name,
        status: domainData.status,
        last_scraped_at: domainData.last_scraped_at
      };
    }
    
    console.log('Domain raw data for normalization:', domainData);
    return normalizeSingleDomain(domainData);
  } catch (error) {
    console.error(`Error fetching domain ${id}:`, error);
    return MOCK_DOMAINS[0];
  }
};

/**
 * Normalize a single domain data object
 * @param {Object} domain - Domain object
 * @returns {Object} Normalized domain object
 */
const normalizeSingleDomain = (domain) => {
  if (!domain) {
    console.warn('Empty domain data received');
    return MOCK_DOMAINS[0];
  }
  
  console.log('Domain raw data for normalization:', domain);
  
  // First check for domain_name in any format
  const domainName = domain.domain_name || domain.domainName || domain.domain || domain.url || domain.name;
  if (!domainName) {
    console.warn('Domain missing name, falling back to mock data:', domain);
    return MOCK_DOMAINS[0];
  }
  
  // Create the normalized domain object
  const normalizedDomain = {
    domainId: domain.id?.toString() || domain.domainId,
    domainName: domainName,
    status: domain.status || 'unknown',
    lastScraped: domain.last_scraped_at || domain.lastScraped,
    crawlProgress: {
      pagesTotal: domain.pages?.length || domain.page_count || 0,
      pagesCrawled: domain.pages_crawled || 0,
      status: domain.status || 'unknown'
    },
    // Include metadata if available
    metadata: domain.metadata || {},
    // Include pages if available
    pages: domain.pages || [],
    // Include opengraph data if available
    opengraph: domain.opengraph || [],
    // Include media data if available
    media: domain.media || { images: { all: [] } },
    // Include brandfetch data if available
    brandfetch: domain.brandfetch || null,
    // Include podcast data if available
    data: {
      podcasts: domain.data?.podcasts || domain.podcasts || null
    },
    // Include AI analysis data if available
    aiAnalysis: domain.aiAnalysis || domain.ai_analysis || null,
    brandAnalysis: domain.brandAnalysis || domain.brand_analysis || null,
    contentCategories: domain.contentCategories || domain.content_categories || [],
    appIdeas: domain.appIdeas || domain.app_ideas || [],
    appSuggestions: domain.appSuggestions || domain.app_suggestions || {},
    features: domain.features || [],
    marketingTips: domain.marketingTips || domain.marketing_tips || [],
    // Add a flag to indicate this is from the API
    isFromApi: true
  };
  
  console.log('Normalized domain:', normalizedDomain);
  return normalizedDomain;
};

/**
 * Create a new domain crawl
 * @param {Object} domainData - Domain data
 * @param {string} domainData.domain - Domain URL
 * @param {number} domainData.crawl_depth - Optional crawl depth
 * @returns {Promise<Object>} Created domain object
 */
export const createDomain = async (domainData) => {
  try {
    const response = await api.post('/scrape', domainData);
    return response.data;
  } catch (error) {
    console.error('Error creating domain:', error);
    throw error;
  }
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('apiToken');
};

/**
 * Store API key in storage
 * @param {string} apiKey - API key
 */
export const storeApiKey = (apiKey) => {
  if (!apiKey) {
    console.warn('Attempted to store empty API key');
    return;
  }
  localStorage.setItem('apiToken', apiKey);
  console.log('API key stored in localStorage:', apiKey);
};

/**
 * Remove API key from storage (logout)
 */
export const removeApiKey = () => {
  localStorage.removeItem('apiToken');
};

// Try with the default test key if no key is already stored
if (!localStorage.getItem('apiToken')) {
  console.log('No API key found in storage, using default test key');
  storeApiKey('test-api-key-123');
}

export default api; 