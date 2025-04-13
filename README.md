# Domain Crawler Dashboard

A modern React-based dashboard for visualizing data from the domain crawler system. The dashboard provides a comprehensive UI for exploring all aspects of the crawled data.

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

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Navigate to the crawler-dashboard directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file with your configuration (see `.env.example` for required variables)

### Development

To start the development server:

```bash
npm run dev
```

The dashboard will be available at http://localhost:5173.

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

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