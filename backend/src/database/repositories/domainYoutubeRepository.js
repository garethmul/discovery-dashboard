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
    // Get channel data with all fields
    const [channels] = await pool.query(
      `SELECT 
        domain_id, channel_id, name, description, published_at, thumbnail_url,
        subscriber_count, view_count, video_count, country, topic_categories,
        etag, kind, custom_url, default_language, localized_title, 
        localized_description, hidden_subscriber_count, related_playlists,
        privacy_status, is_linked, long_uploads_status, made_for_kids,
        self_declared_made_for_kids, branding_settings, audit_details,
        content_owner, time_linked, localizations
       FROM domain_youtube_channels 
       WHERE domain_id = ?`,
      [domainId]
    );
    
    // Return early if no channel data exists
    if (channels.length === 0) {
      return null;
    }
    
    // Get playlists with all fields
    const [playlists] = await pool.query(
      `SELECT 
        playlist_id, domain_id, channel_id, title, description,
        published_at, item_count, playlist_type
       FROM domain_youtube_playlists 
       WHERE domain_id = ?`,
      [domainId]
    );
    
    // Get videos with all fields
    const [videos] = await pool.query(
      `SELECT 
        video_id, domain_id, channel_id, title, description, published_at,
        duration, definition, caption_available, licensed_content, privacy_status,
        license, view_count, like_count, comment_count, category_id,
        tags, topics, thumbnail_default, thumbnail_high, made_for_kids
       FROM domain_youtube_videos 
       WHERE domain_id = ? 
       ORDER BY published_at DESC`,
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
    
    // Get comments for all videos with all fields
    const [comments] = await pool.query(
      `SELECT 
        comment_id, domain_id, video_id, parent_comment_id, author_name,
        author_channel_id, text, like_count, published_at, updated_at
       FROM domain_youtube_comments 
       WHERE domain_id = ? AND video_id IN (${placeholders})
       ORDER BY published_at DESC`,
      [domainId, ...videoIds]
    );
    
    // Get captions for all videos with all fields
    const [captions] = await pool.query(
      `SELECT 
        caption_id, domain_id, video_id, language, name,
        auto_generated, caption_type, last_updated
       FROM domain_youtube_captions 
       WHERE domain_id = ? AND video_id IN (${placeholders})`,
      [domainId, ...videoIds]
    );
    
    // Get topics for all videos with all fields
    const [topics] = await pool.query(
      `SELECT 
        id, domain_id, video_id, topic_id, topic_category, type
       FROM domain_youtube_video_topics 
       WHERE domain_id = ? AND video_id IN (${placeholders})`,
      [domainId, ...videoIds]
    );
    
    // Get extraction job history with all fields
    const [jobs] = await pool.query(
      `SELECT 
        id, domain_id, domain_name, channel_id, status, source_url, source,
        result, created_at, updated_at, quota_credits, quota_usage_details
       FROM youtube_extraction_jobs 
       WHERE domain_id = ? 
       ORDER BY created_at DESC`,
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