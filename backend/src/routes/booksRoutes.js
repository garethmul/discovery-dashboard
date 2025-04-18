import express from 'express';
import * as domainBooksRepository from '../database/repositories/domainBooksRepository.js';
import logger from '../utils/logger.js';
import authMiddleware from '../utils/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

/**
 * GET /books/:domainId
 * Retrieve all books data for a domain
 */
router.get('/:domainId', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    logger.info(`[API] Fetching books data for domain ID: ${domainId}`);
    const booksData = await domainBooksRepository.getAllBooksData(domainId);
    
    if (!booksData) {
      return res.status(404).json({ error: 'No books data found for this domain' });
    }
    
    return res.json(booksData);
  } catch (error) {
    logger.error(`Error retrieving books data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve books data' });
  }
});

/**
 * GET /books/:domainId/isbn/:isbn
 * Retrieve details for a specific book by ISBN
 */
router.get('/:domainId/isbn/:isbn', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    const isbn = req.params.isbn;
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    if (!isbn) {
      return res.status(400).json({ error: 'ISBN is required' });
    }
    
    logger.info(`[API] Fetching details for book ISBN ${isbn} on domain ID: ${domainId}`);
    const bookDetails = await domainBooksRepository.getBookDetails(domainId, isbn);
    
    if (!bookDetails) {
      return res.status(404).json({ error: 'No details found for this book ISBN' });
    }
    
    return res.json(bookDetails);
  } catch (error) {
    logger.error(`Error retrieving book details: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve book details' });
  }
});

/**
 * GET /books/:domainId/search
 * Search across all books for a domain
 */
router.get('/:domainId/search', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    const { query } = req.query;
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    logger.info(`[API] Searching books for domain ID: ${domainId}, query: "${query}"`);
    const searchResults = await domainBooksRepository.searchBooks(domainId, query);
    
    return res.json({
      query,
      results: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    logger.error(`Error searching books: ${error.message}`);
    return res.status(500).json({ error: 'Failed to search books' });
  }
});

export default router; 