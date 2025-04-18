import express from 'express';
import * as domainExternalLinksRepository from '../database/repositories/domainExternalLinksRepository.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/external-links/:domainId
 * Retrieve all external links data for a domain
 */
router.get('/:domainId', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    logger.info(`[API] Fetching external links data for domain ID: ${domainId}`);
    const externalLinksData = await domainExternalLinksRepository.getAllExternalLinksData(domainId);
    
    if (!externalLinksData) {
      return res.status(404).json({ error: 'No external links data found for this domain' });
    }
    
    return res.json(externalLinksData);
  } catch (error) {
    logger.error(`Error retrieving external links data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve external links data' });
  }
});

/**
 * GET /api/external-links/:domainId/domain/:externalDomain
 * Retrieve details for a specific external domain
 */
router.get('/:domainId/domain/:externalDomain', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    const externalDomain = req.params.externalDomain;
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    if (!externalDomain) {
      return res.status(400).json({ error: 'External domain is required' });
    }
    
    logger.info(`[API] Fetching details for external domain ${externalDomain} on domain ID: ${domainId}`);
    const domainDetails = await domainExternalLinksRepository.getExternalDomainDetails(domainId, externalDomain);
    
    if (!domainDetails) {
      return res.status(404).json({ error: 'No details found for this external domain' });
    }
    
    return res.json(domainDetails);
  } catch (error) {
    logger.error(`Error retrieving external domain details: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve external domain details' });
  }
});

/**
 * GET /api/external-links/:domainId/search
 * Search across all external links
 */
router.get('/:domainId/search', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    const { query, is_active } = req.query;
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const isActive = is_active === undefined ? true : is_active === '1' || is_active === 'true';
    
    logger.info(`[API] Searching external links for domain ID: ${domainId}, query: "${query}"`);
    const searchResults = await domainExternalLinksRepository.searchExternalLinks(domainId, query, isActive);
    
    return res.json({
      query,
      is_active: isActive,
      results: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    logger.error(`Error searching external links: ${error.message}`);
    return res.status(500).json({ error: 'Failed to search external links' });
  }
});

export default router; 