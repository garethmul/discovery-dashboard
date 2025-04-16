import express from 'express';
import * as domainYoutubeRepository from '../database/repositories/domainYoutubeRepository.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/youtube/:domainId
 * Retrieve all YouTube data for a domain
 */
router.get('/:domainId', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    logger.info(`[API] Fetching YouTube data for domain ID: ${domainId}`);
    const youtubeData = await domainYoutubeRepository.getAllYoutubeData(domainId);
    
    if (!youtubeData) {
      return res.status(404).json({ error: 'No YouTube data found for this domain' });
    }
    
    return res.json(youtubeData);
  } catch (error) {
    logger.error(`Error retrieving YouTube data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve YouTube data' });
  }
});

export default router; 