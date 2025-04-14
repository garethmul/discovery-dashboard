import React, { useState } from "react";
import { AlertTriangle, Headphones, Music, Calendar, Clock, ExternalLink, ChevronDown, ChevronRight, Play, Pause } from "lucide-react";

export default function DomainPodcasts({ domain }) {
  console.log('DomainPodcasts received domain:', domain);

  // Track which feeds are expanded
  const [expandedFeeds, setExpandedFeeds] = useState(new Set());
  // Add state for currently playing audio
  const [playingAudio, setPlayingAudio] = useState(null);

  if (!domain?.data?.podcasts?.episodes) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Podcast Data Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No podcast information has been crawled for this domain.
        </p>
      </div>
    );
  }

  const episodes = domain.data.podcasts.episodes || [];

  // Group episodes by feed_id
  const episodesByFeed = episodes.reduce((acc, episode) => {
    const feedId = episode.feed_id;
    if (!acc[feedId]) {
      acc[feedId] = [];
    }
    acc[feedId].push(episode);
    return acc;
  }, {});

  // Toggle feed expansion
  const toggleFeed = (feedId) => {
    const newExpanded = new Set(expandedFeeds);
    if (newExpanded.has(feedId)) {
      newExpanded.delete(feedId);
    } else {
      newExpanded.add(feedId);
    }
    setExpandedFeeds(newExpanded);
  };

  // Handle audio playback
  const toggleAudio = (audioUrl, episodeId) => {
    if (playingAudio?.episodeId === episodeId) {
      // Stop current audio
      playingAudio.audio.pause();
      setPlayingAudio(null);
    } else {
      // Stop previous audio if any
      if (playingAudio) {
        playingAudio.audio.pause();
      }
      // Start new audio
      const audio = new Audio(audioUrl);
      audio.play();
      setPlayingAudio({ audio, episodeId });
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(episodesByFeed).map(([feedId, feedEpisodes]) => {
        const isExpanded = expandedFeeds.has(feedId);
        // Use the first episode to get feed information
        const firstEpisode = feedEpisodes[0];
        
        return (
          <div key={feedId} className="rounded-lg border">
            {/* Feed Header - Always visible */}
            <div 
              className="flex items-start justify-between p-4 cursor-pointer hover:bg-muted/50"
              onClick={() => toggleFeed(feedId)}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-4">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  {/* Show feed image if available */}
                  {firstEpisode.image_url && (
                    <img
                      src={firstEpisode.image_url}
                      alt="Podcast feed"
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-medium">Feed {feedId}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feedEpisodes.length} episodes
                    </p>
                  </div>
                </div>
              </div>
              <Headphones className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Episodes Section - Visible when expanded */}
            {isExpanded && (
              <div className="border-t">
                {feedEpisodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="p-4 hover:bg-muted/50 border-b last:border-b-0"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex gap-4">
                        {/* Episode Image */}
                        {episode.image_url && (
                          <div className="shrink-0">
                            <img
                              src={episode.image_url}
                              alt={episode.title || "Podcast episode"}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-grow">
                          <h4 className="font-medium">
                            {episode.title}
                          </h4>
                          
                          {episode.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {episode.description}
                            </p>
                          )}
                          
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            {episode.published_date && (
                              <div className="inline-flex items-center text-xs text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(episode.published_date).toLocaleDateString()}
                              </div>
                            )}
                            
                            {episode.duration && (
                              <div className="inline-flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {episode.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-2">
                        {/* Audio Player */}
                        {episode.audio_url && (
                          <>
                            <button
                              onClick={() => toggleAudio(episode.audio_url, episode.id)}
                              className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                              {playingAudio?.episodeId === episode.id ? (
                                <>
                                  <Pause className="mr-1 h-4 w-4" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="mr-1 h-4 w-4" />
                                  Play
                                </>
                              )}
                            </button>
                            <audio
                              controls
                              className="w-48 h-8"
                              src={episode.audio_url}
                            >
                              Your browser does not support the audio element.
                            </audio>
                          </>
                        )}
                        
                        {episode.page_url && (
                          <a
                            href={episode.page_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-muted px-3 py-1.5 text-sm font-medium hover:bg-muted/80"
                          >
                            <ExternalLink className="mr-1 h-4 w-4" />
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 