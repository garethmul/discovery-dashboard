# Discovery Dashboard

A dashboard for viewing crawler data with a built-in mock backend for development.

## Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   npm run install:backend
   ```

## Development

To run both the frontend and backend together:

```bash
# Using npm script
npm run dev:all

# Or using the convenience scripts
./start.sh    # On macOS/Linux
start.bat     # On Windows
```

The application will be available at:
- Frontend: http://localhost:5176
- Backend API: http://localhost:3009

## Production Build

To build the frontend for production:

```bash
npm run build
```

To include the frontend build in the backend for serving:

```bash
npm run setup
```

Then you can deploy the entire backend directory which will serve both the API and the frontend.

## Environment Configuration

- `.env` - Main environment variables for the frontend
- `backend/.env` - Environment variables for the backend API

## Backend API

The backend provides mock API endpoints for development that mimic the format of the production API:

- `/health-check` - Health check endpoint
- `/domain-data` - List all domains
- `/domain-data/:id` - Get domain details by ID

## Features

- **Authentication**: Secure access via API key or username/password
- **Domain List**: View and search all crawled domains
- **Domain Details**: Comprehensive view of domain data with separate tabs for each data type:
  - General info and metadata
  - Site structure visualization
  - Blog content
  - Media (images, videos)
  - Social media profiles
  - External links analysis
  - Apps and events
  - Podcasts and feeds
  - Job listings
  - ISBN data
  - OpenGraph metadata
  - YouTube content
  - Schema markup
  - Brand analysis
  - Color scheme information
  - AI-generated insights and suggestions

## Project Structure

- `src/components/domain/` - Domain-specific components for each data type
- `src/components/layout/` - Layout components (navbar, sidebar)
- `src/components/auth/` - Authentication components
- `src/pages/` - Page components
- `src/services/` - Service modules for API calls
- `src/utils/` - Utility functions

## API Integration

The dashboard connects to the Domain Crawler API at the configured endpoint. It uses authentication via Bearer token (API key) for all requests.

### Required API Endpoints

- `/api/domain-data` - Get all domains
- `/api/domain-data/:domainId` - Get detailed data for a specific domain
- `/api/auth/login` - Authenticate user (if using username/password authentication)

See the API documentation for more details on the expected response structure.

## Data Visualization

The dashboard provides visualizations for various aspects of the crawled data:

- Blog content in card format with pagination
- Site structure as an expandable tree view
- Image galleries with lightbox for fullscreen viewing
- Color schemes with visual swatches
- Social media links and profiles
- AI-generated insights and suggestions in organized tabs

## Authentication

The dashboard supports two authentication methods:

1. **API Key**: Direct authentication using an API key
2. **Username/Password**: Authentication via the login API endpoint

## Technology Stack

- **React**: UI library
- **React Router**: Routing
- **Material UI**: Component library
- **Axios**: HTTP client
- **Vite**: Build tool

## Further Development

Future improvements could include:

- Dashboard analytics and statistics
- User management
- Crawl job scheduling and monitoring
- Data export functionality
- Real-time notifications
- Advanced search and filtering

# Discovery Dashboard Database Tables and API Response

## Table Usage Analysis

### 1. Podcast Data (`domain_podcast_feeds` and `domain_podcast_episodes`)
- These tables are actively used and their data is included in the API response
- The data appears in the response under `domain.podcasts` or `domain.podcast` with two sub-sections:
  - `feeds`: Contains podcast feed information
  - `episodes`: Contains individual episode information
- The `DomainPodcasts` component handles rendering this data

### 2. RSS Feeds (`domain_rss_feeds`)
- The table exists but is not explicitly included in the API response
- RSS feed data is extracted and stored but may not be exposed in the frontend

### 3. Blog Content
- The code references blog content extraction but no specific `domain_blog_content` table is found in the schema
- Blog content appears to be handled differently, possibly through a different mechanism

### 4. Schema Markup
- No `domain_schema_markup` table or related code found in the provided snippets
- This might be handled in a different part of the codebase

### 5. ISBN Data (`domain_isbn_data` and `domain_isbn_images`)
- These tables are actively used to store ISBN information and related images
- The data is extracted by `isbnExtractor` and saved via `saveIsbnData`
- However, there's no clear evidence of this data being included in the API response

### 6. Social and Podcast Data (`domain_social_podcast`)
- This table is used to store social links and podcast-related information
- The data is accessed through `domainSocialPodcastRepository`
- It appears to be included in the API response, as evidenced by the `socialPodcast` variable in the domain data controller

## API Response Structure

The domain data controller (`domainDataController.js`) aggregates data into a response object that includes:
- Domain basic info
- Metadata
- General info
- Blog info
- Media content
- Social podcast data
- Colors
- AI analysis data

## Data Usage Patterns

The data from these tables is used in different ways:
1. Some data (like podcasts) is directly exposed in the API and has dedicated frontend components
2. Other data (like ISBN) is stored but may not be directly exposed in the current frontend implementation
3. Some tables mentioned might not exist or might be handled differently than what's visible in the provided code 