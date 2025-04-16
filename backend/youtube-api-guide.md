## Developer Guide: Creating a Comprehensive YouTube Data API

This section provides guidance for developers who need to create an API endpoint that retrieves all YouTube data for a domain across all YouTube tables.

### Data Model Overview

The YouTube extraction process stores data in 7 interconnected tables, all linked by `domain_id`:

```
domain_youtube_channels
        ↑
        |
        ├─── domain_youtube_playlists
        |
        ├─── domain_youtube_videos
        |     ↑
        |     |
        |     ├─── domain_youtube_comments
        |     |
        |     ├─── domain_youtube_captions
        |     |
        |     └─── domain_youtube_video_topics
        |
        └─── youtube_extraction_jobs
```

### Implementing a Comprehensive YouTube Data API

Here's how to create an API endpoint that retrieves all YouTube data for a domain:

1. **Create a Repository Method**

```javascript
// In src/database/repositories/domainYoutubeRepository.js

/**
 * Get all YouTube data for a domain
 * @param {number} domainId - The domain ID
 * @returns {Promise<object>} - Complete YouTube data for the domain
 */
export async function getAllYoutubeData(domainId) {
  const pool = getPool();
  
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
      channel: channels[0],
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
  
  // Organize video relationships (optional enhancement)
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
  
  // Return complete dataset
  return {
    channel: channels[0],
    playlists,
    videos: videos.map(v => videoMap[v.video_id]),
    recentVideos: videos.slice(0, 10), // First 10 videos
    popularVideos: [...videos].sort((a, b) => b.view_count - a.view_count).slice(0, 10), // Top 10 by views
    jobs,
    stats: {
      totalVideos: videos.length,
      totalPlaylists: playlists.length,
      totalComments: comments.length,
      viewCount: channels[0].view_count,
      subscriberCount: channels[0].subscriber_count
    }
  };
}
```

2. **Create the API Route Handler**

```javascript
// In src/routes/youtubeRoutes.js

import express from 'express';
import * as domainYoutubeRepository from '../database/repositories/domainYoutubeRepository.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/youtube/all/:domainId
 * Retrieve all YouTube data for a domain
 */
router.get('/all/:domainId', async (req, res) => {
  try {
    const domainId = parseInt(req.params.domainId, 10);
    
    if (isNaN(domainId)) {
      return res.status(400).json({ error: 'Invalid domain ID' });
    }
    
    const youtubeData = await domainYoutubeRepository.getAllYoutubeData(domainId);
    
    if (!youtubeData) {
      return res.status(404).json({ error: 'No YouTube data found for this domain' });
    }
    
    return res.json(youtubeData);
  } catch (error) {
    logger.error(`Error retrieving all YouTube data: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve YouTube data' });
  }
});

export default router;
```

3. **Register the Route in Your Express App**

```javascript
// In src/app.js or wherever you configure routes

import youtubeRoutes from './routes/youtubeRoutes.js';

// ...

app.use('/api/youtube', youtubeRoutes);
```

4. **API Response Structure**

The API will return a comprehensive JSON structure with all YouTube data:

```json
{
  "channel": { /* channel data */ },
  "playlists": [ /* array of playlists */ ],
  "videos": [
    {
      /* video data */
      "comments": [ /* comments for this video */ ],
      "captions": [ /* captions for this video */ ],
      "topics": [ /* topics for this video */ ]
    }
  ],
  "recentVideos": [ /* 10 most recent videos */ ],
  "popularVideos": [ /* 10 most viewed videos */ ],
  "jobs": [ /* extraction job history */ ],
  "stats": {
    "totalVideos": 123,
    "totalPlaylists": 15,
    "totalComments": 456,
    "viewCount": 789012,
    "subscriberCount": 3456
  }
}
```

5. **Performance Considerations**

- For domains with a large amount of YouTube data, consider adding pagination
- Use caching for frequently accessed domains
- Consider implementing field selection to allow clients to request only specific data

## Database Schema: Field Definitions

Below is a detailed description of each field in the YouTube extraction tables. This information can help developers understand the data model when building applications.

### Database Schema Structure

The database schema has been updated with proper AUTO_INCREMENT specification and foreign key constraints for data integrity. Here's the complete schema:

```sql
CREATE TABLE IF NOT EXISTS `domain_youtube_channels` (
  `domain_id` INT NOT NULL COMMENT 'Primary key linking to domain entity. Identifies which domain owns this YouTube channel.',
  `channel_id` VARCHAR(24) NOT NULL COMMENT 'YouTube\'s unique identifier for the channel (starts with "UC").',
  `name` VARCHAR(255) NOT NULL COMMENT 'The display name/title of the YouTube channel.',
  `description` TEXT COMMENT 'The full channel description as provided by the channel owner.',
  `published_at` DATETIME COMMENT 'When the channel was created on YouTube.',
  `thumbnail_url` VARCHAR(255) COMMENT 'URL to the channel\'s default thumbnail/avatar image.',
  `subscriber_count` BIGINT COMMENT 'Number of subscribers to the channel.',
  `view_count` BIGINT COMMENT 'Total view count across all videos on the channel.',
  `video_count` INT COMMENT 'Total number of videos uploaded to the channel.',
  `country` VARCHAR(100) COMMENT 'Country code where the channel is based (if provided).',
  `topic_categories` TEXT COMMENT 'JSON array of Wikipedia category URLs representing the channel\'s topics.',
  PRIMARY KEY (`domain_id`),
  UNIQUE INDEX `idx_youtube_channels_channel_id` (`channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `domain_youtube_playlists` (
  `playlist_id` VARCHAR(50) NOT NULL COMMENT 'Primary key, YouTube\'s unique identifier for the playlist.',
  `domain_id` INT NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `channel_id` VARCHAR(24) NOT NULL COMMENT 'YouTube channel ID that owns this playlist.',
  `title` VARCHAR(255) NOT NULL COMMENT 'The title of the playlist.',
  `description` TEXT COMMENT 'The description of the playlist (may be empty).',
  `published_at` DATETIME COMMENT 'When the playlist was created.',
  `item_count` INT COMMENT 'Number of videos in the playlist.',
  `playlist_type` VARCHAR(50) COMMENT 'Categorizes the playlist (e.g., "Uploads" for the auto-generated uploads playlist, or "Custom" for user-created playlists).',
  PRIMARY KEY (`playlist_id`),
  INDEX `idx_youtube_playlists_domain_id` (`domain_id`),
  INDEX `idx_youtube_playlists_channel_id` (`channel_id`),
  CONSTRAINT `fk_playlists_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_youtube_channels` (`domain_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_playlists_channel_id` FOREIGN KEY (`channel_id`) REFERENCES `domain_youtube_channels` (`channel_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `domain_youtube_videos` (
  `video_id` CHAR(11) NOT NULL COMMENT 'Primary key, YouTube\'s unique identifier for the video.',
  `domain_id` INT NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `channel_id` VARCHAR(24) NOT NULL COMMENT 'The YouTube channel ID that uploaded this video.',
  `title` VARCHAR(255) NOT NULL COMMENT 'The title of the video.',
  `description` LONGTEXT COMMENT 'The full description of the video.',
  `published_at` DATETIME COMMENT 'When the video was published on YouTube.',
  `duration` VARCHAR(20) COMMENT 'Video length in ISO 8601 duration format (e.g., "PT1H30M15S" for 1 hour, 30 minutes, 15 seconds).',
  `definition` VARCHAR(10) COMMENT 'Video quality, either "sd" (standard definition) or "hd" (high definition).',
  `caption_available` BOOLEAN COMMENT 'Whether the video has any captions/subtitles available.',
  `licensed_content` BOOLEAN COMMENT 'Whether the content is marked as licensed by YouTube.',
  `privacy_status` VARCHAR(20) COMMENT 'Privacy setting of the video ("public", "unlisted", or "private").',
  `license` VARCHAR(50) COMMENT 'License type for the video (e.g., "youtube" for standard YouTube license, "creativeCommon" for CC license).',
  `view_count` BIGINT COMMENT 'Number of views the video has received.',
  `like_count` BIGINT COMMENT 'Number of likes the video has received.',
  `comment_count` BIGINT COMMENT 'Number of comments on the video.',
  `category_id` INT COMMENT 'YouTube category ID for the video.',
  `tags` TEXT COMMENT 'JSON array of tags assigned to the video.',
  `topics` TEXT COMMENT 'JSON array of topic category URLs associated with this video.',
  `thumbnail_default` VARCHAR(255) COMMENT 'URL to the default (small) thumbnail image.',
  `thumbnail_high` VARCHAR(255) COMMENT 'URL to the high-resolution thumbnail image.',
  `made_for_kids` BOOLEAN COMMENT 'Whether the video is designated as made for children.',
  PRIMARY KEY (`video_id`),
  INDEX `idx_youtube_videos_domain_id` (`domain_id`),
  INDEX `idx_youtube_videos_channel_id` (`channel_id`),
  INDEX `idx_youtube_videos_published_at` (`published_at`),
  INDEX `idx_youtube_videos_view_count` (`view_count`),
  CONSTRAINT `fk_videos_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_youtube_channels` (`domain_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_videos_channel_id` FOREIGN KEY (`channel_id`) REFERENCES `domain_youtube_channels` (`channel_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `domain_youtube_comments` (
  `comment_id` VARCHAR(50) NOT NULL COMMENT 'Primary key, YouTube\'s unique identifier for the comment.',
  `domain_id` INT NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `video_id` CHAR(11) NOT NULL COMMENT 'Foreign key to the video this comment belongs to.',
  `parent_comment_id` VARCHAR(50) COMMENT 'For replies, the ID of the parent comment; NULL for top-level comments.',
  `author_name` VARCHAR(100) COMMENT 'Display name of the comment author.',
  `author_channel_id` VARCHAR(24) COMMENT 'YouTube channel ID of the comment author (if available).',
  `text` TEXT COMMENT 'The comment text content.',
  `like_count` INT COMMENT 'Number of likes on this comment.',
  `published_at` DATETIME COMMENT 'When the comment was posted.',
  `updated_at` DATETIME COMMENT 'When the comment was last edited (if applicable).',
  PRIMARY KEY (`comment_id`),
  INDEX `idx_youtube_comments_domain_id` (`domain_id`),
  INDEX `idx_youtube_comments_video_id` (`video_id`),
  INDEX `idx_youtube_comments_parent_id` (`parent_comment_id`),
  CONSTRAINT `fk_comments_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_youtube_channels` (`domain_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_video_id` FOREIGN KEY (`video_id`) REFERENCES `domain_youtube_videos` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_comments_parent_id` FOREIGN KEY (`parent_comment_id`) REFERENCES `domain_youtube_comments` (`comment_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `domain_youtube_captions` (
  `caption_id` VARCHAR(50) NOT NULL COMMENT 'Primary key, YouTube\'s unique identifier for the caption track.',
  `domain_id` INT NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `video_id` CHAR(11) NOT NULL COMMENT 'Foreign key to the video this caption belongs to.',
  `language` VARCHAR(20) COMMENT 'Language code of the caption (e.g., "en" for English).',
  `name` VARCHAR(255) COMMENT 'Optional name/title of the caption track.',
  `auto_generated` BOOLEAN COMMENT 'Whether this is an automatically generated caption track.',
  `caption_type` VARCHAR(20) COMMENT 'Type of caption (e.g., "standard" or "ASR" for auto-generated).',
  `last_updated` DATETIME COMMENT 'When the caption track was last updated.',
  PRIMARY KEY (`caption_id`),
  INDEX `idx_youtube_captions_domain_id` (`domain_id`),
  INDEX `idx_youtube_captions_video_id` (`video_id`),
  CONSTRAINT `fk_captions_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_youtube_channels` (`domain_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_captions_video_id` FOREIGN KEY (`video_id`) REFERENCES `domain_youtube_videos` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `domain_youtube_video_topics` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment primary key.',
  `domain_id` INT NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `video_id` CHAR(11) NOT NULL COMMENT 'Foreign key to the video.',
  `topic_id` VARCHAR(50) COMMENT 'Optional identifier for the topic, may be NULL for category-only entries.',
  `topic_category` VARCHAR(255) COMMENT 'URL to a Wikipedia category representing the topic (e.g., "https://en.wikipedia.org/wiki/Religion").',
  `type` VARCHAR(20) COMMENT 'Classification of the topic reference (typically "category").',
  PRIMARY KEY (`id`),
  INDEX `idx_youtube_video_topics_domain_id` (`domain_id`),
  INDEX `idx_youtube_video_topics_video_id` (`video_id`),
  UNIQUE INDEX `idx_youtube_video_topics_video_topic` (`video_id`, `topic_category`(191)),
  CONSTRAINT `fk_topics_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_youtube_channels` (`domain_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_topics_video_id` FOREIGN KEY (`video_id`) REFERENCES `domain_youtube_videos` (`video_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `youtube_extraction_jobs` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT 'Auto-increment primary key for the job.',
  `domain_id` INT NOT NULL COMMENT 'Foreign key linking to domain entity.',
  `domain_name` VARCHAR(255) NOT NULL COMMENT 'Domain name used for searching if channel ID not found in social links.',
  `status` ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT 'Current status of the job ("pending", "processing", "completed", or "failed").',
  `result` JSON NULL COMMENT 'Result data from the extraction process, including success status and error details if applicable.',
  `created_at` DATETIME NOT NULL COMMENT 'When the job was created.',
  `updated_at` DATETIME NOT NULL COMMENT 'When the job was last updated.',
  PRIMARY KEY (`id`),
  INDEX `idx_youtube_extraction_jobs_domain_id` (`domain_id`),
  INDEX `idx_youtube_extraction_jobs_status` (`status`),
  INDEX `idx_youtube_extraction_jobs_created_at` (`created_at`),
  CONSTRAINT `fk_jobs_domain_id` FOREIGN KEY (`domain_id`) REFERENCES `domain_youtube_channels` (`domain_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Key Updates to the Schema

1. **AUTO_INCREMENT Fix for domain_youtube_video_topics**
   - Added proper `AUTO_INCREMENT=1` specification for the `id` field
   - This resolves the "Field 'id' doesn't have a default value" error previously encountered

2. **Added Foreign Key Constraints**
   - Foreign key constraints maintain data integrity across all tables
   - `ON DELETE CASCADE` ensures that when a parent record is deleted, all related child records are also deleted
   - `ON UPDATE CASCADE` ensures that when a parent key is updated, the change propagates to child records

3. **Field Comments**
   - All fields now include descriptive comments that explain their purpose and formatting
   - These comments are visible in database management tools like phpMyAdmin

### Table: domain_youtube_channels

| Field | Type | Description |
|-------|------|-------------|
| domain_id | INT | Primary key linking to domain entity. Identifies which domain owns this YouTube channel. |
| channel_id | VARCHAR(24) | YouTube's unique identifier for the channel (starts with "UC"). |
| name | VARCHAR(255) | The display name/title of the YouTube channel. |
| description | TEXT | The full channel description as provided by the channel owner. |
| published_at | DATETIME | When the channel was created on YouTube. |
| thumbnail_url | VARCHAR(255) | URL to the channel's default thumbnail/avatar image. |
| subscriber_count | BIGINT | Number of subscribers to the channel. |
| view_count | BIGINT | Total view count across all videos on the channel. |
| video_count | INT | Total number of videos uploaded to the channel. |
| country | VARCHAR(100) | Country code where the channel is based (if provided). |
| topic_categories | TEXT | JSON array of Wikipedia category URLs representing the channel's topics. |

### Table: domain_youtube_playlists

| Field | Type | Description |
|-------|------|-------------|
| playlist_id | VARCHAR(50) | Primary key, YouTube's unique identifier for the playlist. |
| domain_id | INT | Foreign key linking to domain entity. |
| channel_id | VARCHAR(24) | YouTube channel ID that owns this playlist. |
| title | VARCHAR(255) | The title of the playlist. |
| description | TEXT | The description of the playlist (may be empty). |
| published_at | DATETIME | When the playlist was created. |
| item_count | INT | Number of videos in the playlist. |
| playlist_type | VARCHAR(50) | Categorizes the playlist (e.g., "Uploads" for the auto-generated uploads playlist, or "Custom" for user-created playlists). |

### Table: domain_youtube_videos

| Field | Type | Description |
|-------|------|-------------|
| video_id | CHAR(11) | Primary key, YouTube's unique identifier for the video. |
| domain_id | INT | Foreign key linking to domain entity. |
| channel_id | VARCHAR(24) | The YouTube channel ID that uploaded this video. |
| title | VARCHAR(255) | The title of the video. |
| description | LONGTEXT | The full description of the video. |
| published_at | DATETIME | When the video was published on YouTube. |
| duration | VARCHAR(20) | Video length in ISO 8601 duration format (e.g., "PT1H30M15S" for 1 hour, 30 minutes, 15 seconds). |
| definition | VARCHAR(10) | Video quality, either "sd" (standard definition) or "hd" (high definition). |
| caption_available | BOOLEAN | Whether the video has any captions/subtitles available. |
| licensed_content | BOOLEAN | Whether the content is marked as licensed by YouTube. |
| privacy_status | VARCHAR(20) | Privacy setting of the video ("public", "unlisted", or "private"). |
| license | VARCHAR(50) | License type for the video (e.g., "youtube" for standard YouTube license, "creativeCommon" for CC license). |
| view_count | BIGINT | Number of views the video has received. |
| like_count | BIGINT | Number of likes the video has received. |
| comment_count | BIGINT | Number of comments on the video. |
| category_id | INT | YouTube category ID for the video. |
| tags | TEXT | JSON array of tags assigned to the video. |
| topics | TEXT | JSON array of topic category URLs associated with this video. |
| thumbnail_default | VARCHAR(255) | URL to the default (small) thumbnail image. |
| thumbnail_high | VARCHAR(255) | URL to the high-resolution thumbnail image. |
| made_for_kids | BOOLEAN | Whether the video is designated as made for children. |

### Table: domain_youtube_comments

| Field | Type | Description |
|-------|------|-------------|
| comment_id | VARCHAR(50) | Primary key, YouTube's unique identifier for the comment. |
| domain_id | INT | Foreign key linking to domain entity. |
| video_id | CHAR(11) | Foreign key to the video this comment belongs to. |
| parent_comment_id | VARCHAR(50) | For replies, the ID of the parent comment; NULL for top-level comments. |
| author_name | VARCHAR(100) | Display name of the comment author. |
| author_channel_id | VARCHAR(24) | YouTube channel ID of the comment author (if available). |
| text | TEXT | The comment text content. |
| like_count | INT | Number of likes on this comment. |
| published_at | DATETIME | When the comment was posted. |
| updated_at | DATETIME | When the comment was last edited (if applicable). |

### Table: domain_youtube_captions

| Field | Type | Description |
|-------|------|-------------|
| caption_id | VARCHAR(50) | Primary key, YouTube's unique identifier for the caption track. |
| domain_id | INT | Foreign key linking to domain entity. |
| video_id | CHAR(11) | Foreign key to the video this caption belongs to. |
| language | VARCHAR(20) | Language code of the caption (e.g., "en" for English). |
| name | VARCHAR(255) | Optional name/title of the caption track. |
| auto_generated | BOOLEAN | Whether this is an automatically generated caption track. |
| caption_type | VARCHAR(20) | Type of caption (e.g., "standard" or "ASR" for auto-generated). |
| last_updated | DATETIME | When the caption track was last updated. |

### Table: domain_youtube_video_topics

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Auto-increment primary key. |
| domain_id | INT | Foreign key linking to domain entity. |
| video_id | CHAR(11) | Foreign key to the video. |
| topic_id | VARCHAR(50) | Optional identifier for the topic, may be NULL for category-only entries. |
| topic_category | VARCHAR(255) | URL to a Wikipedia category representing the topic (e.g., "https://en.wikipedia.org/wiki/Religion"). |
| type | VARCHAR(20) | Classification of the topic reference (typically "category"). |

### Table: youtube_extraction_jobs

| Field | Type | Description |
|-------|------|-------------|
| id | INT | Auto-increment primary key for the job. |
| domain_id | INT | Foreign key linking to domain entity. |
| domain_name | VARCHAR(255) | Domain name used for searching if channel ID not found in social links. |
| status | VARCHAR(20) | Current status of the job ("pending", "processing", "completed", or "failed"). |
| result | JSON | Result data from the extraction process, including success status and error details if applicable. |
| created_at | DATETIME | When the job was created. |
| updated_at | DATETIME | When the job was last updated. |

## Architecture

### Components

1. **YouTube Channel Extractor** (`src/services/contentExtractors/youtubeChannelExtractor.js`)
   - Handles all API calls to YouTube Data API
   - Processes and stores the retrieved data

2. **YouTube Service** (`src/services/youtubeService.js`)
   - Coordinates the extraction process
   - Manages extraction jobs

3. **YouTube Repository** (`src/database/repositories/domainYoutubeRepository.js`)
   - Provides data access methods
   - Abstracts database interactions

4. **YouTube Routes** (`src/routes/youtubeRoutes.js`)
   - Defines API endpoints for interacting with YouTube data
