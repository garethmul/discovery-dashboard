import express from 'express';
import * as domainYoutubeRepository from '../database/repositories/domainYoutubeRepository.js';
import logger from '../utils/logger.js';
import authMiddleware from '../utils/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

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
    
    // If no data found, return empty structure instead of 404
    if (!youtubeData) {
      return res.status(200).json({
        channels: [],
        playlists: [],
        videos: [],
        comments: [],
        captions: [],
        topics: [],
        jobs: [],
        stats: {
          totalVideos: 0,
          totalPlaylists: 0,
          totalComments: 0,
          viewCount: 0,
          subscriberCount: 0
        }
      });
    }
    
    // Ensure stats is always present with default values
    if (!youtubeData.stats) {
      youtubeData.stats = {
        totalVideos: 0,
        totalPlaylists: 0,
        totalComments: 0,
        viewCount: 0,
        subscriberCount: 0
      };
    }
    
    // Ensure channel data has all expected fields (especially for frontend compatibility)
    if (youtubeData.channels && youtubeData.channels.length > 0) {
      youtubeData.channels.forEach(channel => {
        // Handle JSON fields that might be strings
        ['related_playlists', 'branding_settings', 'audit_details', 'localizations'].forEach(field => {
          if (channel[field] && typeof channel[field] === 'string') {
            try {
              channel[field] = JSON.parse(channel[field]);
            } catch (e) {
              logger.warn(`Could not parse JSON for ${field} in channel ${channel.channel_id}`);
            }
          }
        });
      });
    }
    
    // Ensure video data has all expected fields
    if (youtubeData.videos && youtubeData.videos.length > 0) {
      youtubeData.videos.forEach(video => {
        // Handle JSON fields that might be strings
        ['tags', 'topics'].forEach(field => {
          if (video[field] && typeof video[field] === 'string') {
            try {
              video[field] = JSON.parse(video[field]);
            } catch (e) {
              logger.warn(`Could not parse JSON for ${field} in video ${video.video_id}`);
            }
          }
        });
      });
    }
    
    // Ensure job data has all expected fields
    if (youtubeData.jobs && youtubeData.jobs.length > 0) {
      youtubeData.jobs.forEach(job => {
        // Handle JSON fields that might be strings
        ['result', 'quota_usage_details'].forEach(field => {
          if (job[field] && typeof job[field] === 'string') {
            try {
              job[field] = JSON.parse(job[field]);
            } catch (e) {
              logger.warn(`Could not parse JSON for ${field} in job ${job.id}`);
            }
          }
        });
      });
    }
    
    return res.json(youtubeData);
  } catch (error) {
    logger.error(`Error retrieving YouTube data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve YouTube data' });
  }
});

export default router; 