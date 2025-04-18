# External Links API & Frontend Specification

This document outlines the structure and requirements for building an API and frontend interface to expose external links data from the database.

## Database Structure

The external links data is stored in two complementary tables:

### 1. domain_external_links (Summary Table)

This table provides aggregated information about all external domains linked from a website.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| domain_id | int | Foreign key to the domain entity |
| external_domain | varchar(255) | The hostname of the external website being linked to |
| link_count | int | Number of links to this external domain (default: 1) |
| is_partner | tinyint(1) | Boolean flag indicating if this is likely a partner website (0 = no, 1 = yes) |
| partner_confidence | float | Confidence score for the partner designation (0.0 - 1.0) |
| partner_context | text | Contextual information about why this is identified as a partner |
| example_url | varchar(1024) | Example URL pointing to this external domain |
| created_at | timestamp | When this record was created |
| updated_at | timestamp | When this record was last updated |

### 2. domain_external_links_detail (Detail Table)

This table contains individual link instances with complete contextual information.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| domain_id | int | Foreign key to the domain entity |
| external_domain | varchar(255) | The hostname of the external website being linked to |
| source_url | varchar(1024) | The URL of the page containing the link |
| target_url | varchar(1024) | The full URL being linked to (destination) |
| link_text | text | The text content of the link |
| is_partner | tinyint(1) | Boolean flag indicating if this appears to be a partner link (0 = no, 1 = yes) |
| partner_context | text | Contextual information about why this is identified as a partner |
| img_src | varchar(1024) | If the link contains an image, the image source URL |
| img_alt | text | If the link contains an image, the alt text |
| page_id | int | Reference to the page ID if available |
| element_html | text | HTML markup of the link element |
| seen_in_last_crawl | tinyint(1) | Boolean flag indicating if this link was seen in the most recent crawl (0 = no, 1 = yes) |
| is_active | tinyint(1) | Boolean flag indicating if this link is still active (0 = no, 1 = yes) |
| last_seen_at | timestamp | When this link was last observed during a crawl |
| created_at | timestamp | When this record was created |

## API Requirements

Implement the following RESTful API endpoints to expose the external links data:

### 1. Summary Endpoints

#### Get all external domains for a website
```
GET /api/domains/{domainId}/external-links
```

**Query Parameters:**
- `limit` - Maximum number of results to return (default: 20)
- `offset` - Pagination offset (default: 0)
- `sort_by` - Field to sort by (default: "link_count")
- `sort_dir` - Sort direction ("asc" or "desc", default: "desc")
- `is_partner` - Filter by partner status (0 or 1)
- `min_confidence` - Minimum partner confidence score (0.0 - 1.0)

**Response Format:**
```json
{
  "total": 142,
  "limit": 20,
  "offset": 0,
  "data": [
    {
      "id": 1234,
      "external_domain": "partner-site.com",
      "link_count": 15,
      "is_partner": 1,
      "partner_confidence": 0.92,
      "partner_context": "Multiple mentions with partner-related text",
      "example_url": "https://partner-site.com/page",
      "created_at": "2025-03-15T12:00:00Z",
      "updated_at": "2025-04-10T09:30:00Z"
    },
    // Additional results...
  ]
}
```

#### Get partner domains
```
GET /api/domains/{domainId}/partner-links
```

**Query Parameters:**
- Same as above, but defaults `is_partner=1` and `min_confidence=0.7`

### 2. Detail Endpoints

#### Get all links to a specific external domain
```
GET /api/domains/{domainId}/external-links/{externalDomain}/details
```

**Query Parameters:**
- `limit` - Maximum number of results to return (default: 50)
- `offset` - Pagination offset (default: 0)
- `is_active` - Filter by active status (0 or 1, default: 1)
- `source_url` - Filter by source URL (optional)

**Response Format:**
```json
{
  "total": 15,
  "limit": 50,
  "offset": 0,
  "summary": {
    "external_domain": "partner-site.com",
    "link_count": 15,
    "is_partner": 1,
    "partner_confidence": 0.92
  },
  "data": [
    {
      "id": 5678,
      "source_url": "https://example.com/page1",
      "target_url": "https://partner-site.com/offer",
      "link_text": "View special offer",
      "is_partner": 1,
      "partner_context": "Contains promotional language",
      "img_src": "https://example.com/images/partner-logo.png",
      "img_alt": "Partner Logo",
      "element_html": "<a href=\"https://partner-site.com/offer\"><img src=\"/images/partner-logo.png\" alt=\"Partner Logo\"> View special offer</a>",
      "seen_in_last_crawl": 1,
      "is_active": 1,
      "last_seen_at": "2025-04-10T09:30:00Z",
      "created_at": "2025-03-15T12:00:00Z"
    },
    // Additional results...
  ]
}
```

#### Search across all external links
```
GET /api/domains/{domainId}/external-links/search
```

**Query Parameters:**
- `query` - Text search across link_text, target_url and element_html
- `limit` - Maximum number of results to return (default: 20)
- `offset` - Pagination offset (default: 0)
- `is_active` - Filter by active status (0 or 1, default: 1)

## Frontend Requirements

Create a frontend interface that provides the following features:

### 1. External Links Dashboard

Build a dashboard view that shows:

- Total number of external domains linked to
- Total number of individual external links
- Breakdown of partner vs. non-partner links
- Top 10 most linked-to external domains (with counts)
- Graph showing partnership confidence distribution

### 2. External Domains List View

Create a paginated, sortable table showing:

- External domain name
- Link count
- Partner status (with confidence indicator)
- First seen date
- Last seen date
- Action buttons for viewing details

Include filters for:
- Partner status
- Min/max link count
- Active/inactive status
- Date ranges

### 3. External Domain Detail View

For a specific external domain, show:

- Summary statistics (total links, active links, etc.)
- Partnership information with confidence visualization
- List of all individual links to this domain, including:
  - Source page
  - Target URL
  - Link text/content
  - Visual preview of the link (using element_html)
  - Status indicators (active, seen in last crawl)
  - Timeline of when the link was first/last seen

### 4. Partnership Network Visualization

Create a visual network graph showing:

- The primary domain at the center
- External domains as nodes (sized by link count)
- Lines connecting domains (thickness based on link count)
- Color-coding to indicate partner status and confidence

### 5. Historical Tracking

Implement a timeline view showing:

- When external domains were first linked to
- Changes in link counts over time
- Changes in partnership status
- Links that have been removed or become inactive

## Technical Implementation Guidelines

1. **API Development**:
   - Use RESTful design principles
   - Implement proper error handling and status codes
   - Ensure efficient database queries with appropriate indexing
   - Add rate limiting for public endpoints
   - Include comprehensive API documentation

2. **Frontend Development**:
   - Build responsive interfaces that work on desktop and mobile
   - Implement efficient data loading with pagination and lazy loading
   - Use data visualization libraries for graphs and network diagrams
   - Create intuitive filtering and search interfaces
   - Ensure accessibility compliance

3. **Performance Considerations**:
   - For domains with thousands of external links, optimize database queries
   - Implement caching for frequently accessed data
   - Use frontend virtualization for long lists
   - Consider implementing summary aggregation jobs for large datasets

4. **Data Refresh Strategy**:
   - Clearly indicate when data was last updated
   - Provide refresh functionality for on-demand updates
   - Show crawl status and history

## Delivery Requirements

The completed solution should include:

1. API endpoints as specified above
2. Frontend interface implementing all required views
3. Documentation for both API and frontend
4. Testing coverage for all major functionality 