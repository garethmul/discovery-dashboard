import { getPool } from '../../utils/database.js';
import logger from '../../utils/logger.js';

/**
 * Get all books data for a domain
 * @param {number} domainId - The domain ID
 * @returns {Promise<object>} - Complete books data for the domain
 */
export async function getAllBooksData(domainId) {
  const pool = await getPool();
  
  try {
    // Get ISBN data from domain_isbn_data table
    const [isbnData] = await pool.query(
      `SELECT 
        id, domain_id, isbn, isbn_type, page_url, context, created_at, updated_at 
       FROM domain_isbn_data 
       WHERE domain_id = ?
       ORDER BY created_at DESC`,
      [domainId]
    );
    
    // Get ISBN images from domain_isbn_images table
    const [isbnImages] = await pool.query(
      `SELECT 
        id, domain_id, isbn, image_url, page_url, alt_text, created_at, updated_at 
       FROM domain_isbn_images 
       WHERE domain_id = ?
       ORDER BY created_at DESC`,
      [domainId]
    );
    
    // Return early if no data exists
    if (isbnData.length === 0 && isbnImages.length === 0) {
      return null;
    }
    
    // Get unique ISBNs from both tables
    const uniqueIsbns = [...new Set([
      ...isbnData.map(item => item.isbn),
      ...isbnImages.map(item => item.isbn)
    ])];
    
    // Create placeholders for the IN clause
    const placeholders = uniqueIsbns.map(() => '?').join(',');
    
    // Get all book details in a single query instead of multiple individual queries
    const [allBookData] = await pool.query(
      `SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT ba.name SEPARATOR '|') as author_names
       FROM books b
       LEFT JOIN book_author_mapping bam ON b.id = bam.book_id
       LEFT JOIN book_authors ba ON bam.author_id = ba.id
       WHERE b.isbn IN (${placeholders}) OR b.isbn13 IN (${placeholders})
       GROUP BY b.id`,
      [...uniqueIsbns, ...uniqueIsbns]
    );
    
    // Get all subjects in a single query with book_id mapping
    const [allSubjects] = await pool.query(
      `SELECT 
        bsm.book_id,
        bs.id, 
        bs.name
       FROM book_subject_mapping bsm
       JOIN book_subjects bs ON bsm.subject_id = bs.id
       WHERE bsm.book_id IN (
         SELECT id FROM books WHERE isbn IN (${placeholders}) OR isbn13 IN (${placeholders})
       )`,
      [...uniqueIsbns, ...uniqueIsbns]
    );
    
    // Get all prices in a single query with book_id mapping
    const [allPrices] = await pool.query(
      `SELECT 
        book_id,
        id, book_condition, merchant, merchant_logo, 
        shipping, price, total, link, created_at
       FROM book_prices 
       WHERE book_id IN (
         SELECT id FROM books WHERE isbn IN (${placeholders}) OR isbn13 IN (${placeholders})
       )
       ORDER BY book_id, price ASC`,
      [...uniqueIsbns, ...uniqueIsbns]
    );
    
    // Get all other ISBNs in a single query with book_id mapping
    const [allOtherIsbns] = await pool.query(
      `SELECT 
        book_id,
        isbn, binding
       FROM book_other_isbns 
       WHERE book_id IN (
         SELECT id FROM books WHERE isbn IN (${placeholders}) OR isbn13 IN (${placeholders})
       )`,
      [...uniqueIsbns, ...uniqueIsbns]
    );
    
    // Get all reviews in a single query with book_id mapping
    const [allReviews] = await pool.query(
      `SELECT 
        book_id,
        id, review_text
       FROM book_reviews 
       WHERE book_id IN (
         SELECT id FROM books WHERE isbn IN (${placeholders}) OR isbn13 IN (${placeholders})
       )`,
      [...uniqueIsbns, ...uniqueIsbns]
    );
    
    // Create a map of book data
    const booksMap = allBookData.reduce((map, book) => {
      map[book.isbn] = book;
      if (book.isbn13) map[book.isbn13] = book;
      return map;
    }, {});
    
    // Group subjects by book_id
    const subjectsByBookId = allSubjects.reduce((map, subject) => {
      if (!map[subject.book_id]) map[subject.book_id] = [];
      map[subject.book_id].push({ id: subject.id, name: subject.name });
      return map;
    }, {});
    
    // Group prices by book_id
    const pricesByBookId = allPrices.reduce((map, price) => {
      if (!map[price.book_id]) map[price.book_id] = [];
      map[price.book_id].push(price);
      return map;
    }, {});
    
    // Group other ISBNs by book_id
    const otherIsbnsByBookId = allOtherIsbns.reduce((map, otherIsbn) => {
      if (!map[otherIsbn.book_id]) map[otherIsbn.book_id] = [];
      map[otherIsbn.book_id].push({ isbn: otherIsbn.isbn, binding: otherIsbn.binding });
      return map;
    }, {});
    
    // Group reviews by book_id
    const reviewsByBookId = allReviews.reduce((map, review) => {
      if (!map[review.book_id]) map[review.book_id] = [];
      map[review.book_id].push({ id: review.id, review_text: review.review_text });
      return map;
    }, {});
    
    // Prepare book details
    const bookDetails = [];
    
    for (const isbn of uniqueIsbns) {
      const book = booksMap[isbn];
      
      if (book) {
        // Transform author_names from pipe-delimited string to array
        const authors = book.author_names ? book.author_names.split('|') : [];
        delete book.author_names;
        
        // Find references to this book in the domain
        const bookReferences = isbnData.filter(item => item.isbn === isbn);
        const bookImages = isbnImages.filter(item => item.isbn === isbn);
        
        // Add all data to the book details
        bookDetails.push({
          ...book,
          authors: authors.map(name => ({ name })),
          subjects: subjectsByBookId[book.id] || [],
          reviews: reviewsByBookId[book.id] || [],
          prices: pricesByBookId[book.id] || [],
          other_isbns: otherIsbnsByBookId[book.id] || [],
          domain_references: bookReferences,
          domain_images: bookImages
        });
      } else {
        // If the book is not in our database but the domain references it,
        // still include the reference information
        bookDetails.push({
          isbn: isbn,
          domain_references: isbnData.filter(item => item.isbn === isbn),
          domain_images: isbnImages.filter(item => item.isbn === isbn),
          available: false
        });
      }
    }
    
    // Calculate statistics
    const totalBooks = bookDetails.length;
    const availableBooks = bookDetails.filter(book => book.available !== false).length;
    const totalReferences = isbnData.length;
    const totalImages = isbnImages.length;
    
    // Return complete dataset
    return {
      books: bookDetails,
      references: isbnData,
      images: isbnImages,
      stats: {
        totalBooks,
        availableBooks,
        totalReferences,
        totalImages
      }
    };
  } catch (error) {
    logger.error(`Error retrieving books data: ${error.message}`);
    throw error;
  }
}

/**
 * Get detail data for a specific book by ISBN
 * @param {number} domainId - The domain ID
 * @param {string} isbn - The ISBN to get details for
 * @returns {Promise<object>} - Detailed information about the book
 */
export async function getBookDetails(domainId, isbn) {
  const pool = await getPool();
  
  try {
    // Get book details with authors in a single query
    const [bookData] = await pool.query(
      `SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT ba.name SEPARATOR '|') as author_names
       FROM books b
       LEFT JOIN book_author_mapping bam ON b.id = bam.book_id
       LEFT JOIN book_authors ba ON bam.author_id = ba.id
       WHERE b.isbn = ? OR b.isbn13 = ?
       GROUP BY b.id`,
      [isbn, isbn]
    );
    
    if (bookData.length === 0) {
      return null;
    }
    
    const book = bookData[0];
    
    // Execute multiple queries in parallel to improve performance
    const [subjectData, reviewData, priceData, otherIsbnData, bookReferences, bookImages] = await Promise.all([
      // Get subjects for this book
      pool.query(
        `SELECT 
          bs.id, bs.name
         FROM book_subjects bs
         JOIN book_subject_mapping bsm ON bs.id = bsm.subject_id
         WHERE bsm.book_id = ?`,
        [book.id]
      ),
      
      // Get reviews for this book
      pool.query(
        `SELECT id, review_text FROM book_reviews WHERE book_id = ?`,
        [book.id]
      ),
      
      // Get pricing information for this book
      pool.query(
        `SELECT 
          id, book_condition, merchant, merchant_logo, 
          shipping, price, total, link, created_at
         FROM book_prices 
         WHERE book_id = ?
         ORDER BY price ASC`,
        [book.id]
      ),
      
      // Get alternative ISBNs for this book
      pool.query(
        `SELECT isbn, binding FROM book_other_isbns WHERE book_id = ?`,
        [book.id]
      ),
      
      // Get domain references to this book
      pool.query(
        `SELECT id, domain_id, isbn, isbn_type, page_url, context, created_at, updated_at 
         FROM domain_isbn_data 
         WHERE domain_id = ? AND isbn = ?`,
        [domainId, isbn]
      ),
      
      // Get domain images for this book
      pool.query(
        `SELECT id, domain_id, isbn, image_url, page_url, alt_text, created_at, updated_at 
         FROM domain_isbn_images 
         WHERE domain_id = ? AND isbn = ?`,
        [domainId, isbn]
      )
    ]);
    
    // Transform author_names from pipe-delimited string to array
    const authors = book.author_names ? book.author_names.split('|') : [];
    delete book.author_names;
    
    // Return complete book data
    return {
      ...book,
      authors: authors.map(name => ({ name })),
      subjects: subjectData[0],
      reviews: reviewData[0],
      prices: priceData[0],
      other_isbns: otherIsbnData[0],
      domain_references: bookReferences[0],
      domain_images: bookImages[0]
    };
  } catch (error) {
    logger.error(`Error retrieving book details: ${error.message}`);
    throw error;
  }
}

/**
 * Search across all books for a domain
 * @param {number} domainId - The domain ID
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Matching books
 */
export async function searchBooks(domainId, query) {
  const pool = await getPool();
  
  try {
    // Get unique ISBNs for this domain
    const [isbnData] = await pool.query(
      `SELECT DISTINCT isbn 
       FROM domain_isbn_data 
       WHERE domain_id = ?`,
      [domainId]
    );
    
    const [isbnImages] = await pool.query(
      `SELECT DISTINCT isbn 
       FROM domain_isbn_images 
       WHERE domain_id = ?`,
      [domainId]
    );
    
    // Combine unique ISBNs
    const uniqueIsbns = [...new Set([
      ...isbnData.map(item => item.isbn),
      ...isbnImages.map(item => item.isbn)
    ])];
    
    if (uniqueIsbns.length === 0) {
      return [];
    }
    
    // Create placeholders for the IN clause
    const placeholders = uniqueIsbns.map(() => '?').join(',');
    
    // Use MATCH AGAINST instead of LIKE for more efficient searching
    const [results] = await pool.query(
      `SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT ba.name SEPARATOR '|') as author_names
       FROM books b
       LEFT JOIN book_author_mapping bam ON b.id = bam.book_id
       LEFT JOIN book_authors ba ON bam.author_id = ba.id
       WHERE (b.isbn IN (${placeholders}) OR b.isbn13 IN (${placeholders}))
       AND (
         MATCH(b.title) AGAINST(? IN BOOLEAN MODE) OR
         MATCH(b.publisher) AGAINST(? IN BOOLEAN MODE) OR
         MATCH(ba.name) AGAINST(? IN BOOLEAN MODE) OR
         b.isbn = ? OR
         b.isbn13 = ?
       )
       GROUP BY b.id
       LIMIT 50`,
      [...uniqueIsbns, ...uniqueIsbns, `${query}*`, `${query}*`, `${query}*`, query, query]
    );
    
    // Transform results
    return results.map(book => {
      const authors = book.author_names ? book.author_names.split('|') : [];
      delete book.author_names;
      
      return {
        ...book,
        authors: authors.map(name => ({ name }))
      };
    });
  } catch (error) {
    logger.error(`Error searching books: ${error.message}`);
    throw error;
  }
} 