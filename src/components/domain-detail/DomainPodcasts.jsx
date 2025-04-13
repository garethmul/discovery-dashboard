import React from "react";
import { AlertTriangle, Headphones, Music, Calendar, Clock, ExternalLink } from "lucide-react";

export default function DomainPodcasts({ domain }) {
  if (!domain || (!domain.podcasts && !domain.podcast)) {
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

  // Handle both possible object structures
  const podcastData = domain.podcasts || domain.podcast || {};
  const feeds = podcastData.feeds || [];
  const episodes = podcastData.episodes || [];

  return (
    <div className="space-y-6">
      {/* Podcast Feeds Section */}
      {feeds && feeds.length > 0 ? (
        <div>
          <h3 className="mb-4 text-lg font-medium">Podcast Feeds</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {feeds.map((feed, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <h4 className="font-medium">{feed.title || "Untitled Feed"}</h4>
                    {feed.author && (
                      <p className="text-sm text-muted-foreground">by {feed.author}</p>
                    )}
                    {feed.feedType && (
                      <div className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {feed.feedType.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <Headphones className="h-5 w-5 text-muted-foreground" />
                </div>

                {feed.description && (
                  <p className="mt-2 line-clamp-2 text-sm">{feed.description}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {feed.episodeCount > 0 && (
                    <div className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs">
                      <Music className="mr-1 h-3 w-3" />
                      {feed.episodeCount} episodes
                    </div>
                  )}
                  
                  {feed.feedUrl && (
                    <a
                      href={feed.feedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs hover:bg-muted/80"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Feed URL
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <Headphones className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 text-base font-medium">No Podcast Feeds Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            No podcast feeds were detected for this domain.
          </p>
        </div>
      )}

      {/* Podcast Episodes Section */}
      {episodes && episodes.length > 0 ? (
        <div>
          <h3 className="mb-4 text-lg font-medium">Recent Episodes</h3>
          <div className="space-y-4">
            {episodes.slice(0, 10).map((episode, index) => (
              <div
                key={index}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {episode.imageUrl && (
                    <div className="shrink-0">
                      <img
                        src={episode.imageUrl}
                        alt={episode.title || "Podcast episode"}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-grow">
                    <h4 className="font-medium">
                      {episode.title || "Untitled Episode"}
                    </h4>
                    
                    {episode.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {episode.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {episode.publishedDate && (
                        <div className="inline-flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(episode.publishedDate).toLocaleDateString()}
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
                  
                  <div className="shrink-0">
                    {episode.audioUrl && (
                      <a
                        href={episode.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <Music className="mr-1 h-4 w-4" />
                        Listen
                      </a>
                    )}
                    
                    {episode.pageUrl && !episode.audioUrl && (
                      <a
                        href={episode.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {episodes.length > 10 && (
              <div className="flex justify-center">
                <div className="rounded-md bg-muted px-4 py-2 text-sm">
                  + {episodes.length - 10} more episodes
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
} 