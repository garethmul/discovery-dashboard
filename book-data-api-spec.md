# Book Data API & Frontend Specification

This document outlines the structure and requirements for building an API and frontend interface to expose book data from the database.

## Database Structure

The book data is stored in a set of related tables with the main `books` table serving as the central entity. The domain_isbn_data.isbn and domain_isbn_images.isbn fields are keys to the books.isbn field, which in turn links to the other book-related tables with the books.id field as the foreign key.

### 1. books (Main Table)

This table contains the primary book information sourced from ISBNdb.com API.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| isbn | varchar(20) | ISBN-10 identifier (UNIQUE) |
| isbn13 | varchar(20) | ISBN-13 identifier |
| title | varchar(255) | Book title |
| title_long | text | Extended/complete book title |
| dewey_decimal | varchar(50) | Dewey Decimal classification |
| binding | varchar(100) | Book binding type (e.g., Hardcover, Paperback) |
| publisher | varchar(255) | Publisher name |
| language | varchar(50) | Language of the book |
| date_published | date | Publication date |
| edition | varchar(100) | Edition information |
| pages | int | Number of pages |
| dimensions | varchar(255) | Physical dimensions as a formatted string |
| overview | text | Brief overview of the book |
| image | varchar(255) | URL to the book cover image |
| image_original | varchar(255) | URL to the original, high-resolution cover image |
| msrp | decimal(10,2) | Manufacturer's Suggested Retail Price |
| excerpt | text | Book excerpt or sample content |
| synopsis | text | Book synopsis/summary |
| dimensions_length_value | decimal(10,2) | Length value |
| dimensions_length_unit | varchar(10) | Length unit (e.g., in, cm) |
| dimensions_width_value | decimal(10,2) | Width value |
| dimensions_width_unit | varchar(10) | Width unit |
| dimensions_height_value | decimal(10,2) | Height value |
| dimensions_height_unit | varchar(10) | Height unit |
| dimensions_weight_value | decimal(10,2) | Weight value |
| dimensions_weight_unit | varchar(10) | Weight unit (e.g., lbs, kg) |
| created_at | timestamp | Record creation timestamp |
| updated_at | timestamp | Record update timestamp |
| last_api_fetch | timestamp | When data was last fetched from the API |

*Note: Has FULLTEXT index on title and publisher fields for efficient searching.*

### 2. book_authors

This table stores unique author names.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| name | varchar(255) | Author's name (UNIQUE) |

### 3. book_author_mapping

This table maps the many-to-many relationship between books and authors.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| book_id | int | Foreign key to books.id |
| author_id | int | Foreign key to book_authors.id |

*Note: Has a unique constraint on book_id and author_id to prevent duplicates.*

### 4. book_subjects

This table stores unique subject categories for books.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| name | varchar(255) | Subject name (UNIQUE) |

### 5. book_subject_mapping

This table maps the many-to-many relationship between books and subjects.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| book_id | int | Foreign key to books.id |
| subject_id | int | Foreign key to book_subjects.id |

*Note: Has a unique constraint on book_id and subject_id to prevent duplicates.*

### 6. book_reviews

This table stores reviews for books.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| book_id | int | Foreign key to books.id |
| review_text | text | The content of the review |

### 7. book_prices

This table stores pricing information from different merchants.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| book_id | int | Foreign key to books.id |
| book_condition | varchar(100) | Condition of the book (e.g., New, Used) |
| merchant | varchar(255) | Merchant/retailer name |
| merchant_logo | varchar(255) | URL to merchant's logo |
| merchant_logo_offset_x | int | X-coordinate offset for logo positioning |
| merchant_logo_offset_y | int | Y-coordinate offset for logo positioning |
| shipping | varchar(100) | Shipping information/cost |
| price | decimal(10,2) | Book price (excluding shipping) |
| total | decimal(10,2) | Total price (including shipping) |
| link | varchar(255) | URL to purchase the book |
| created_at | timestamp | Record creation timestamp |

### 8. book_other_isbns

This table stores alternative ISBNs for the same book (different editions/formats).

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| book_id | int | Foreign key to books.id |
| isbn | varchar(20) | Alternative ISBN |
| binding | varchar(100) | Binding type for this ISBN |

*Note: Has a unique constraint on book_id and isbn to prevent duplicates.*

### 9. isbndb_api_requests

This table tracks API requests to ISBNdb.com for auditing and rate limiting.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| isbn | varchar(20) | ISBN that was requested |
| request_time | timestamp | When the request was made |
| status_code | int | HTTP status code of the response |
| response_message | varchar(255) | Response message or error details |

### 10. cached_books

This table caches book data in JSON format for quick retrieval.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | int | Primary key, auto-increment |
| isbn | varchar(20) | ISBN identifier |
| data | json | Complete book data in JSON format |
| created_at | timestamp | When the cache was created |

## Entity Relationships

- The `books` table is the central entity with ISBN as the unique identifier
- Books can have multiple authors through the `book_author_mapping` table
- Books can have multiple subjects through the `book_subject_mapping` table
- Books can have multiple reviews in the `book_reviews` table
- Books can have multiple price options in the `book_prices` table
- Books can have alternative ISBNs in the `book_other_isbns` table
- The `domain_isbn_data.isbn` and `domain_isbn_images.isbn` fields link to `books.isbn`

## API Requirements

Implement the following RESTful API endpoints to expose the book data:

### 1. Book Retrieval Endpoints

#### Get book by ISBN
```
GET /api/books/isbn/:isbn
```

**Response Format:**
```json
{
  "id": 1234,
  "isbn": "0451524934",
  "isbn13": "9780451524935",
  "title": "1984",
  "title_long": "1984 (Signet Classics)",
  "publisher": "Signet Classics",
  "language": "en",
  "date_published": "1950-07-01",
  "binding": "Mass Market Paperback",
  "pages": 328,
  "dimensions": "4.2 x 0.9 x 7.5 inches",
  "overview": "A dystopian novel set in Airstrip One...",
  "image": "https://example.com/covers/1984.jpg",
  "msrp": 9.99,
  "synopsis": "The story takes place in an imagined future...",
  "authors": [
    {
      "id": 101,
      "name": "George Orwell"
    }
  ],
  "subjects": [
    {
      "id": 201,
      "name": "Dystopian"
    },
    {
      "id": 202,
      "name": "Political fiction"
    }
  ],
  "reviews": [
    {
      "id": 301,
      "review_text": "A masterpiece that remains relevant..."
    }
  ],
  "prices": [
    {
      "id": 401,
      "merchant": "Amazon",
      "book_condition": "New",
      "price": 7.99,
      "shipping": "Free with Prime",
      "total": 7.99,
      "link": "https://amazon.com/..."
    }
  ],
  "other_isbns": [
    {
      "isbn": "0452284236",
      "binding": "Paperback"
    }
  ]
}
```

#### Search books
```
GET /api/books/search
```

**Query Parameters:**
- `query` - Search term for title, author, publisher or ISBN (required, min 2 chars)
- `page` - Pagination page number (default: 1)
- `limit` - Maximum results per page (default: 20)

**Response Format:**
```json
{
  "books": [
    {
      "id": 1234,
      "isbn": "0451524934",
      "isbn13": "9780451524935",
      "title": "1984",
      "publisher": "Signet Classics",
      "authors": ["George Orwell"],
      "binding": "Mass Market Paperback",
      "image": "https://example.com/covers/1984.jpg",
      "date_published": "1950-07-01"
    },
    // Additional results...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### 2. Author and Subject Endpoints

#### Get books by author
```
GET /api/books/author/:authorId
```

**Query Parameters:**
- `page` - Pagination page number (default: 1)
- `limit` - Maximum results per page (default: 20)

#### Get books by subject
```
GET /api/books/subject/:subjectId
```

**Query Parameters:**
- `page` - Pagination page number (default: 1)
- `limit` - Maximum results per page (default: 20)

### 3. Domain ISBN Endpoints

#### Get books referenced by a domain
```
GET /api/domains/:domainId/books
```

**Response Format:**
```json
{
  "domain_id": 5678,
  "domain_name": "example.com",
  "books": [
    {
      "isbn": "0451524934",
      "title": "1984",
      "authors": ["George Orwell"],
      "image": "https://example.com/covers/1984.jpg",
      "references": [
        {
          "page_url": "https://example.com/recommended-books",
          "context": "Featured in dystopian fiction section"
        }
      ],
      "images": [
        {
          "image_url": "https://example.com/images/1984-cover.jpg",
          "page_url": "https://example.com/book-covers",
          "alt_text": "1984 by George Orwell"
        }
      ]
    },
    // Additional books...
  ]
}
```

## Frontend Requirements

Integrate the data from these tables, into the existing Books tab, which currently displays ISBNs found when crawling different websites.

The Books tab currently has very little information about each book, but this new API endpoint will provide richer data to create a more informative display of the information. 

Within the books tab there should be a frontend interface that provides the following features:

### 1. Book Search and Browse

Build a search interface that allows users to:

- Search by title, author, publisher, or ISBN
- Filter results by:
  - Publication date range
  - Subject/genre
  - Binding type
  - Language
- Sort results by:
  - Relevance
  - Publication date
  - Title
  - Price

### 2. Book Detail View

For each book, display:

- Cover image with high-resolution option
- Basic information (title, authors, publisher, publication date)
- Physical details (binding, pages, dimensions)
- Synopsis/overview with expandable sections
- Pricing information from multiple merchants with purchase links
- Reviews
- Related books by same author or in same subject
- Alternative editions with different ISBNs

### 3. Author Detail View

For each author, display:

- Author name
- List of books by the author
- Subjects/genres the author writes in
- Filtering and sorting options for author's books

### 4. Subject/Genre Browse

Allow users to:

- Browse books by subject/genre
- See related/similar subjects
- Filter and sort within a subject

### 5. Domain Book References

For sites that reference books:

- Show which domains reference a particular book
- Show where and how the book is referenced (context)
- Display book cover images used on the site
- Provide links to the original pages where the book is mentioned

## Technical Implementation Guidelines

1. **API Development**:
   - Implement efficient database queries using joins and FULLTEXT indexing
   - Cache frequently requested book data
   - Implement proper error handling for missing books or ISBNs
   - Add rate limiting for public endpoints
   - Ensure ISBN validation and normalization

2. **Frontend Development**:
   - Implement responsive book displays that work on all devices
   - Create image lazy loading for book cover galleries
   - Design intuitive search and filter interfaces
   - Optimize book detail pages for both information density and readability
   - Implement skeleton loaders for book data during API calls

3. **Performance Considerations**:
   - Batch author and subject data to minimize database queries
   - Consider implementing a read-through cache for popular books
   - Optimize image delivery with appropriate sizing and formats
   - Use pagination for all list views

4. **Data Quality**:
   - Handle missing or incomplete book data gracefully
   - Provide fallback images for books without covers
   - Normalize ISBN formats (with and without hyphens)
   - Merge duplicate books and authors when detected

## Delivery Requirements

The completed solution should include:

1. API endpoints as specified above
2. Frontend interface implementing all required views
3. Documentation for both API and frontend
4. Testing coverage for all major functionality
