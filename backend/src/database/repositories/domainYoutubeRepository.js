import { getPool } from '../../utils/database.js';
import logger from '../../utils/logger.js';

/**
 * Get all YouTube data for a domain
 * @param {number} domainId - The domain ID
 * @returns {Promise<object>} - Complete YouTube data for the domain
 */
export async function getAllYoutubeData(domainId) {
  const pool = await getPool();
  
  try {
    // Get channel data
    const [channels] = await pool.query(
      'SELECT * FROM domain_youtube_channels WHERE domain_id = ?',
      [domainId]
    );
    
    // Return early if no channel data exists
    if (channels.length === 0) {
      return null;
    }
    
    // Get playlists
    const [playlists] = await pool.query(
      'SELECT * FROM domain_youtube_playlists WHERE domain_id = ?',
      [domainId]
    );
    
    // Get videos
    const [videos] = await pool.query(
      'SELECT * FROM domain_youtube_videos WHERE domain_id = ? ORDER BY published_at DESC',
      [domainId]
    );
    
    // Get video IDs for subsequent queries
    const videoIds = videos.map(v => v.video_id);
    
    // Return early with partial data if no videos
    if (videoIds.length === 0) {
      return {
        channels,
        playlists,
        videos: [],
        comments: [],
        captions: [],
        topics: []
      };
    }
    
    // Prepare placeholders for IN clause
    const placeholders = videoIds.map(() => '?').join(',');
    
    // Get comments for all videos
    const [comments] = await pool.query(
      `SELECT * FROM domain_youtube_comments 
       WHERE domain_id = ? AND video_id IN (${placeholders})
       ORDER BY published_at DESC`,
      [domainId, ...videoIds]
    );
    
    // Get captions for all videos
    const [captions] = await pool.query(
      `SELECT * FROM domain_youtube_captions 
       WHERE domain_id = ? AND video_id IN (${placeholders})`,
      [domainId, ...videoIds]
    );
    
    // Get topics for all videos
    const [topics] = await pool.query(
      `SELECT * FROM domain_youtube_video_topics 
       WHERE domain_id = ? AND video_id IN (${placeholders})`,
      [domainId, ...videoIds]
    );
    
    // Get extraction job history
    const [jobs] = await pool.query(
      'SELECT * FROM youtube_extraction_jobs WHERE domain_id = ? ORDER BY created_at DESC',
      [domainId]
    );
    
    // Organize video relationships
    const videoMap = {};
    videos.forEach(video => {
      videoMap[video.video_id] = {
        ...video,
        comments: [],
        captions: [],
        topics: []
      };
    });
    
    comments.forEach(comment => {
      if (videoMap[comment.video_id]) {
        videoMap[comment.video_id].comments.push(comment);
      }
    });
    
    captions.forEach(caption => {
      if (videoMap[caption.video_id]) {
        videoMap[caption.video_id].captions.push(caption);
      }
    });
    
    topics.forEach(topic => {
      if (videoMap[topic.video_id]) {
        videoMap[topic.video_id].topics.push(topic);
      }
    });
    
    // Calculate statistics
    const stats = {
      totalVideos: videos.length,
      totalPlaylists: playlists.length,
      totalComments: comments.length,
      viewCount: channels[0]?.view_count || 0,
      subscriberCount: channels[0]?.subscriber_count || 0
    };
    
    // Return complete dataset
    return {
      channels,
      playlists,
      videos: Object.values(videoMap),
      recentVideos: videos.slice(0, 10), // First 10 videos
      popularVideos: [...videos].sort((a, b) => b.view_count - a.view_count).slice(0, 10), // Top 10 by views
      jobs,
      stats
    };
  } catch (error) {
    logger.error(`Error retrieving YouTube data: ${error.message}`);
    throw error;
  }
} 