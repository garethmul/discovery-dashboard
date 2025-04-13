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