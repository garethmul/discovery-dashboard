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
    
    // Fetch detailed book information for each ISBN
    const bookDetails = [];
    
    for (const isbn of uniqueIsbns) {
      // Get book details from the books table
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
      
      if (bookData.length > 0) {
        const book = bookData[0];
        
        // Get subjects for this book
        const [subjectData] = await pool.query(
          `SELECT 
            bs.id, bs.name
           FROM book_subjects bs
           JOIN book_subject_mapping bsm ON bs.id = bsm.subject_id
           WHERE bsm.book_id = ?`,
          [book.id]
        );
        
        // Get reviews for this book
        const [reviewData] = await pool.query(
          `SELECT id, review_text FROM book_reviews WHERE book_id = ?`,
          [book.id]
        );
        
        // Get pricing information for this book
        const [priceData] = await pool.query(
          `SELECT 
            id, book_condition, merchant, merchant_logo, 
            shipping, price, total, link, created_at
           FROM book_prices 
           WHERE book_id = ?
           ORDER BY price ASC`,
          [book.id]
        );
        
        // Get alternative ISBNs for this book
        const [otherIsbnData] = await pool.query(
          `SELECT isbn, binding FROM book_other_isbns WHERE book_id = ?`,
          [book.id]
        );
        
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
          subjects: subjectData,
          reviews: reviewData,
          prices: priceData,
          other_isbns: otherIsbnData,
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
    // Get book details from the books table
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
    
    // Get subjects for this book
    const [subjectData] = await pool.query(
      `SELECT 
        bs.id, bs.name
       FROM book_subjects bs
       JOIN book_subject_mapping bsm ON bs.id = bsm.subject_id
       WHERE bsm.book_id = ?`,
      [book.id]
    );
    
    // Get reviews for this book
    const [reviewData] = await pool.query(
      `SELECT id, review_text FROM book_reviews WHERE book_id = ?`,
      [book.id]
    );
    
    // Get pricing information for this book
    const [priceData] = await pool.query(
      `SELECT 
        id, book_condition, merchant, merchant_logo, 
        shipping, price, total, link, created_at
       FROM book_prices 
       WHERE book_id = ?
       ORDER BY price ASC`,
      [book.id]
    );
    
    // Get alternative ISBNs for this book
    const [otherIsbnData] = await pool.query(
      `SELECT isbn, binding FROM book_other_isbns WHERE book_id = ?`,
      [book.id]
    );
    
    // Transform author_names from pipe-delimited string to array
    const authors = book.author_names ? book.author_names.split('|') : [];
    delete book.author_names;
    
    // Get domain references to this book
    const [bookReferences] = await pool.query(
      `SELECT id, domain_id, isbn, isbn_type, page_url, context, created_at, updated_at 
       FROM domain_isbn_data 
       WHERE domain_id = ? AND isbn = ?`,
      [domainId, isbn]
    );
    
    // Get domain images for this book
    const [bookImages] = await pool.query(
      `SELECT id, domain_id, isbn, image_url, page_url, alt_text, created_at, updated_at 
       FROM domain_isbn_images 
       WHERE domain_id = ? AND isbn = ?`,
      [domainId, isbn]
    );
    
    // Return complete book data
    return {
      ...book,
      authors: authors.map(name => ({ name })),
      subjects: subjectData,
      reviews: reviewData,
      prices: priceData,
      other_isbns: otherIsbnData,
      domain_references: bookReferences,
      domain_images: bookImages
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
    
    // Search across books matching the ISBNs
    const [results] = await pool.query(
      `SELECT 
        b.*,
        GROUP_CONCAT(DISTINCT ba.name SEPARATOR '|') as author_names
       FROM books b
       LEFT JOIN book_author_mapping bam ON b.id = bam.book_id
       LEFT JOIN book_authors ba ON bam.author_id = ba.id
       WHERE (b.isbn IN (${placeholders}) OR b.isbn13 IN (${placeholders}))
       AND (
         b.title LIKE ? OR
         b.publisher LIKE ? OR
         ba.name LIKE ?
       )
       GROUP BY b.id
       LIMIT 50`,
      [...uniqueIsbns, ...uniqueIsbns, `%${query}%`, `%${query}%`, `%${query}%`]
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