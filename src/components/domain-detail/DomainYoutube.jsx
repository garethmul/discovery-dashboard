import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown, ChevronUp, ArrowDownUp, Youtube, Clock, Eye, MessageCircle, Calendar, Film, ListVideo, TrendingUp, Clock4, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatDuration(duration) {
  // Duration is in ISO 8601 format, e.g., "PT1H30M15S"
  if (!duration) return "00:00";
  
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return "00:00";
  
  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  const seconds = matches[3] ? parseInt(matches[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function DomainYoutube({ domain }) {
  const [youtubeData, setYoutubeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ field: 'published_at', direction: 'desc' });
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [expandedChannels, setExpandedChannels] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [showAllPlaylists, setShowAllPlaylists] = useState(false);
  const [playlistSearchTerm, setPlaylistSearchTerm] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  
  useEffect(() => {
    async function fetchYoutubeData() {
      if (!domain?.domainId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`/api/youtube/${domain.domainId}`);
        setYoutubeData(response.data);
        setFilteredVideos(response.data.videos || []);
        
        // Extract recent and popular videos
        if (response.data.videos && response.data.videos.length > 0) {
          // Get 5 most recent videos
          const recent = [...response.data.videos]
            .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
            .slice(0, 5);
          setRecentVideos(recent);
          
          // Get 5 most viewed videos
          const popular = [...response.data.videos]
            .sort((a, b) => b.view_count - a.view_count)
            .slice(0, 5);
          setPopularVideos(popular);
        }
        
        // If there are multiple channels, expand the first one by default
        if (response.data.channels && response.data.channels.length > 0) {
          setExpandedChannels([response.data.channels[0].channel_id]);
        }
      } catch (err) {
        console.error("Error fetching YouTube data:", err);
        setError(err.response?.data?.error || "Failed to load YouTube data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchYoutubeData();
  }, [domain?.domainId]);
  
  useEffect(() => {
    if (!youtubeData?.videos) return;
    
    // Apply search filter
    let videos = [...youtubeData.videos];
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      videos = videos.filter(
        video => 
          video.title?.toLowerCase().includes(search) || 
          video.description?.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    videos.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle dates
      if (sortConfig.field === 'published_at') {
        const dateA = aValue ? new Date(aValue) : new Date(0);
        const dateB = bValue ? new Date(bValue) : new Date(0);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Handle strings
      aValue = String(aValue || '');
      bValue = String(bValue || '');
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
    
    setFilteredVideos(videos);
  }, [youtubeData, searchTerm, sortConfig]);
  
  useEffect(() => {
    if (youtubeData?.playlists) {
      if (playlistSearchTerm.trim() === "") {
        setFilteredPlaylists(youtubeData.playlists);
      } else {
        const search = playlistSearchTerm.toLowerCase();
        const filtered = youtubeData.playlists.filter(
          playlist => 
            playlist.title?.toLowerCase().includes(search) || 
            playlist.description?.toLowerCase().includes(search)
        );
        setFilteredPlaylists(filtered);
      }
    }
  }, [youtubeData?.playlists, playlistSearchTerm]);
  
  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const toggleChannel = (channelId) => {
    setExpandedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);
  
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (!youtubeData || !youtubeData.channels || youtubeData.channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <Youtube className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No YouTube data</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This domain doesn't have any YouTube data available.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* YouTube summary stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Channels</div>
          <div className="mt-1 text-2xl font-bold">{youtubeData.channels.length}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Videos</div>
          <div className="mt-1 text-2xl font-bold">{youtubeData.stats.totalVideos}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Views</div>
          <div className="mt-1 text-2xl font-bold">{formatNumber(youtubeData.stats.viewCount)}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Subscribers</div>
          <div className="mt-1 text-2xl font-bold">{formatNumber(youtubeData.stats.subscriberCount)}</div>
        </div>
      </div>
      
      {/* Channel list */}
      <Accordion type="multiple" value={expandedChannels} className="w-full">
        {youtubeData.channels.map((channel) => (
          <AccordionItem 
            key={channel.channel_id} 
            value={channel.channel_id}
            className="border rounded-md mb-4"
          >
            <AccordionTrigger 
              onClick={(e) => {
                e.preventDefault();
                toggleChannel(channel.channel_id);
              }}
              className="px-4 py-2 hover:no-underline"
            >
              <div className="flex items-center">
                {channel.thumbnail_url && (
                  <img 
                    src={channel.thumbnail_url} 
                    alt={channel.name} 
                    className="mr-3 h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(channel.subscriber_count)} subscribers • {formatNumber(channel.video_count)} videos
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="mb-4 text-sm text-muted-foreground">
                {channel.description}
              </p>
              {expandedChannels.includes(channel.channel_id) && (
                <a 
                  href={`https://youtube.com/channel/${channel.channel_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary"
                >
                  <Youtube className="mr-1 h-4 w-4" />
                  View on YouTube
                </a>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {/* Playlists section */}
      {youtubeData.playlists && youtubeData.playlists.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <ListVideo className="mr-2 h-5 w-5 text-primary" />
            Playlists ({youtubeData.playlists.length})
          </h3>
          
          {/* Show limited playlists when not expanded */}
          {!showAllPlaylists && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {youtubeData.playlists.slice(0, 6).map((playlist) => (
                <div 
                  key={playlist.playlist_id}
                  className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
                >
                  <div className="p-4">
                    <h4 className="font-semibold line-clamp-2">{playlist.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {playlist.description || "No description available"}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground">
                        <Film className="mr-1 h-4 w-4" />
                        {playlist.item_count} videos
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(playlist.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <a 
                      href={`https://youtube.com/playlist?list=${playlist.playlist_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-sm font-medium text-primary"
                    >
                      <Youtube className="mr-1 h-4 w-4" />
                      View Playlist
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Show all playlists with search when expanded */}
          {showAllPlaylists && (
            <>
              <div className="relative w-full md:w-72 mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search playlists..."
                  className="pl-8"
                  value={playlistSearchTerm}
                  onChange={(e) => setPlaylistSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlaylists.map((playlist) => (
                  <div 
                    key={playlist.playlist_id}
                    className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
                  >
                    <div className="p-4">
                      <h4 className="font-semibold">{playlist.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                        {playlist.description || "No description available"}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Film className="mr-1 h-4 w-4" />
                          {playlist.item_count} videos
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(playlist.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <a 
                        href={`https://youtube.com/playlist?list=${playlist.playlist_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-sm font-medium text-primary"
                      >
                        <Youtube className="mr-1 h-4 w-4" />
                        View Playlist
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredPlaylists.length === 0 && (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="max-w-md rounded-lg border p-6">
                    <ListVideo className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No playlists found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Toggle button */}
          {youtubeData.playlists.length > 6 && (
            <div className="flex justify-center">
              <Button 
                variant="outline"
                onClick={() => setShowAllPlaylists(!showAllPlaylists)}
              >
                {showAllPlaylists 
                  ? "Show Less" 
                  : `View All ${youtubeData.playlists.length} Playlists`}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Recent and Popular Videos Tabs */}
      {(recentVideos.length > 0 || popularVideos.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Featured Videos</h3>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="recent" className="flex items-center">
                <Clock4 className="mr-2 h-4 w-4" />
                Recent Videos
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Popular Videos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="mt-4">
              <div className="space-y-4">
                {recentVideos.map((video) => (
                  <div 
                    key={video.video_id}
                    className="flex flex-col md:flex-row overflow-hidden rounded-lg border bg-card shadow-sm"
                  >
                    <div className="relative h-48 md:h-auto md:w-60 flex-shrink-0">
                      <img
                        src={video.thumbnail_high || `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <a 
                            href={`https://youtube.com/watch?v=${video.video_id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            {video.title}
                          </a>
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {video.description}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(video.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Eye className="mr-1 h-4 w-4" />
                          {formatNumber(video.view_count)} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="popular" className="mt-4">
              <div className="space-y-4">
                {popularVideos.map((video) => (
                  <div 
                    key={video.video_id}
                    className="flex flex-col md:flex-row overflow-hidden rounded-lg border bg-card shadow-sm"
                  >
                    <div className="relative h-48 md:h-auto md:w-60 flex-shrink-0">
                      <img
                        src={video.thumbnail_high || `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <a 
                            href={`https://youtube.com/watch?v=${video.video_id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            {video.title}
                          </a>
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {video.description}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(video.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Eye className="mr-1 h-4 w-4" />
                          {formatNumber(video.view_count)} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* All Videos section title */}
      <div className="flex items-center">
        <Film className="mr-2 h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">All Videos</h3>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search videos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Film className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{itemsPerPage} per page</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 20, 50].map((count) => (
                <DropdownMenuItem
                  key={count}
                  onClick={() => {
                    setItemsPerPage(count);
                    setPage(1);
                  }}
                >
                  {count} per page
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Sort buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={sortConfig.field === 'published_at' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('published_at')}
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          Date
          {sortConfig.field === 'published_at' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'title' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('title')}
          className="flex items-center gap-1"
        >
          <ArrowDownUp className="h-4 w-4" />
          Title
          {sortConfig.field === 'title' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'view_count' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('view_count')}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          Views
          {sortConfig.field === 'view_count' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'comment_count' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('comment_count')}
          className="flex items-center gap-1"
        >
          <MessageCircle className="h-4 w-4" />
          Comments
          {sortConfig.field === 'comment_count' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'duration' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('duration')}
          className="flex items-center gap-1"
        >
          <Clock className="h-4 w-4" />
          Duration
          {sortConfig.field === 'duration' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Video list */}
      {paginatedVideos.length > 0 ? (
        <div className="space-y-4">
          {paginatedVideos.map((video) => (
            <div 
              key={video.video_id}
              className="flex flex-col md:flex-row overflow-hidden rounded-lg border bg-card shadow-sm"
            >
              <div className="relative h-48 md:h-auto md:w-80 flex-shrink-0">
                <img
                  src={video.thumbnail_high || `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                  {formatDuration(video.duration)}
                </div>
              </div>
              <div className="flex flex-col justify-between p-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    <a 
                      href={`https://youtube.com/watch?v=${video.video_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {video.title}
                    </a>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {video.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(video.published_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <Eye className="mr-1 h-4 w-4" />
                    {formatNumber(video.view_count)} views
                  </span>
                  {video.comment_count > 0 && (
                    <span className="flex items-center text-muted-foreground">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      {formatNumber(video.comment_count)} comments
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-center">
          <div className="max-w-md rounded-lg border p-6">
            <Film className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No videos found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search criteria." : "No videos available for this domain."}
            </p>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mx-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                // Show all pages if total is 5 or less
                pageNum = i + 1;
              } else if (page <= 3) {
                // At start, show 1,2,3,...,N
                if (i < 4) pageNum = i + 1;
                else return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              } else if (page >= totalPages - 2) {
                // At end, show 1,...,N-2,N-1,N
                if (i === 0) pageNum = 1;
                else if (i === 1) return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
                else pageNum = totalPages - (4 - i);
              } else {
                // In middle, show 1,...,p-1,p,p+1,...,N
                if (i === 0) pageNum = 1;
                else if (i === 1) return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
                else if (i === 4) return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
                else pageNum = page + (i - 2);
              }
              
              return pageNum ? (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={page === pageNum}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ) : null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 