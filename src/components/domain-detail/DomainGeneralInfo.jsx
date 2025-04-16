import React, { useState } from "react";
import { Clock, Globe, Calendar, Server, Image, Headphones, FileText, Link2, X } from "lucide-react";

export default function DomainGeneralInfo({ domain }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  if (!domain) return null;
  
  // Debug the domain structure
  console.log('Domain data in GeneralInfo:', domain);
  
  // Extract values safely with fallbacks
  const domainName = domain.domainName || domain.domain || domain.url || domain.name || "Unknown Domain";
  
  // Add a function to determine and format the domain status
  const getDomainStatusInfo = () => {
    // If we have data from the API with limited information
    if (domain.isFromApi) {
      const hasBeenCrawled = domain.lastScraped != null;
      return {
        label: hasBeenCrawled ? 'Completed' : 'Not crawled yet',
        color: hasBeenCrawled ? 'bg-green-500' : 'bg-amber-500',
        message: hasBeenCrawled 
          ? `This domain was last crawled on ${new Date(domain.lastScraped).toLocaleDateString()}`
          : 'This domain has not been crawled yet'
      };
    }
    
    // For other cases with more detailed status information
    const status = domain.status || domain.crawlProgress?.status || 'unknown';
    
    switch(status.toLowerCase()) {
      case 'complete':
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-green-500',
          message: 'Crawl completed successfully'
        };
      case 'in_progress':
      case 'crawling':
        return {
          label: 'In Progress',
          color: 'bg-blue-500',
          message: 'Crawl is currently in progress'
        };
      case 'failed':
      case 'error':
        return {
          label: 'Failed',
          color: 'bg-red-500',
          message: 'Crawl encountered an error'
        };
      case 'pending':
        return {
          label: 'Pending',
          color: 'bg-amber-500',
          message: 'Crawl is queued but not started yet'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-500',
          message: 'Status information is not available'
        };
    }
  };

  // Use this in the status display
  const statusInfo = getDomainStatusInfo();
  
  // Count items in different collections
  const pageCount = domain.pages?.length || domain.page_count || domain.crawlProgress?.pagesTotal || 0;
  const blogCount = domain.blog?.articles?.length || domain.blog_content?.length || domain.blogs?.length || domain.posts?.length || 0;
  const imageCount = (() => {
    if (domain.media?.images?.all?.length) {
      return domain.media.images.all.length;
    }
    
    // Try to count from different categories if available
    if (domain.media?.images) {
      let count = 0;
      const possibleArrays = [
        'logoImages', 'heroImages', 'bannerImages', 'teamImages', 
        'productImages', 'otherImages', 'backgroundImages', 'galleryImages'
      ];
      
      // Count from category arrays
      possibleArrays.forEach(key => {
        if (Array.isArray(domain.media.images[key])) {
          count += domain.media.images[key].length;
        }
      });
      
      // Count from byCategory if it exists
      if (domain.media.images.byCategory) {
        Object.values(domain.media.images.byCategory).forEach(arr => {
          if (Array.isArray(arr)) {
            count += arr.length;
          }
        });
      }
      
      return count || domain.images?.length || 0;
    }
    
    return domain.images?.length || 0;
  })();
  const podcastEpisodes = domain.podcasts?.episodes?.length || 0;
  const socialProfiles = domain.opengraph?.filter(item => item.isSocialProfile)?.length || 0;
  
  // Check if we have any screenshots
  const hasScreenshots = domain.screenshots && (
    domain.screenshots.desktop || 
    domain.screenshots.mobile || 
    domain.screenshots.desktopFull || 
    domain.screenshots.mobileFull
  );

  // Function to open screenshot modal
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Function to close screenshot modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Domain Overview</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Domain Name</h4>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{domainName}</p>
            {domain.metadata?.title && (
              <p className="mt-1 text-xs text-muted-foreground">Title: {domain.metadata.title}</p>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Status</h4>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${statusInfo.color}`}></span>
              <span className="text-lg font-semibold">{statusInfo.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{statusInfo.message}</p>
            {domain.crawlProgress && (
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Pages total: {domain.crawlProgress.pagesTotal || 0}</p>
                <p>Pages crawled: {domain.crawlProgress.pagesCrawled || 0}</p>
                {domain.crawlProgress.jobId && (
                  <p className="truncate">Job ID: {domain.crawlProgress.jobId}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshots Section */}
      {hasScreenshots && (
        <div>
          <h3 className="text-lg font-medium">Screenshots</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {/* Primary Screenshot (Desktop) */}
            {domain.screenshots.desktop && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Desktop Screenshot</h4>
                </div>
                <div 
                  className="cursor-pointer overflow-hidden rounded border hover:opacity-90 transition-opacity"
                  onClick={() => openModal(domain.screenshots.desktopFull)}
                >
                  <img 
                    src={domain.screenshots.desktop} 
                    alt={`${domainName} desktop screenshot`} 
                    className="w-full h-auto" 
                  />
                </div>
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Click to view full screenshot
                </p>
              </div>
            )}
            
            {/* Secondary Screenshot (Mobile) */}
            {domain.screenshots.mobile && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Mobile Screenshot</h4>
                </div>
                <div 
                  className="cursor-pointer overflow-hidden rounded border hover:opacity-90 transition-opacity"
                  onClick={() => openModal(domain.screenshots.mobileFull)}
                >
                  <img 
                    src={domain.screenshots.mobile} 
                    alt={`${domainName} mobile screenshot`} 
                    className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                  />
                </div>
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  Click to view full screenshot
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium">Crawl Information</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Last Crawled</h4>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {domain.lastScraped
                ? new Date(domain.lastScraped).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Never"}
            </p>
            {domain.crawlTracking && domain.crawlTracking.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Crawl count: {domain.crawlTracking[0].crawlCount || 0}
              </p>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Metadata</h4>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {domain.metadata?.description ? (
                <p className="line-clamp-2">{domain.metadata.description}</p>
              ) : (
                <p>No description available</p>
              )}
            </div>
            {domain.metadata?.logoUrl && (
              <p className="mt-1 text-xs text-muted-foreground truncate">
                Logo URL: {domain.metadata.logoUrl}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Content Statistics</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Pages</h4>
              <span className="text-xl font-bold text-primary">{pageCount}</span>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Images</h4>
              <span className="text-xl font-bold text-primary">{imageCount}</span>
            </div>
            {imageCount > 0 && domain.media?.images && (
              <div className="mt-2 flex flex-wrap gap-1">
                {domain.media.images.logoImages?.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Logos: {domain.media.images.logoImages.length}
                  </span>
                )}
                {domain.media.images.heroImages?.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-300">
                    Hero: {domain.media.images.heroImages.length}
                  </span>
                )}
                {domain.media.images.teamImages?.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Team: {domain.media.images.teamImages.length}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Podcast Episodes</h4>
              <span className="text-xl font-bold text-primary">{podcastEpisodes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      {domain.opengraph && domain.opengraph.length > 0 && (
        <div>
          <h3 className="text-lg font-medium">Social Profiles</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Connected Platforms</h4>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {domain.opengraph
                  .filter(item => item.isSocialProfile || item.type === 'social_profile')
                  .map((profile, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {profile.platform || profile.title}
                      </span>
                    </div>
                  ))}
                {(domain.opengraph.filter(item => item.isSocialProfile || item.type === 'social_profile').length === 0) && (
                  <p className="text-sm text-muted-foreground">No social profiles found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Information */}
      {domain.brandfetch && domain.brandfetch.data && (
        <div>
          <h3 className="text-lg font-medium">Brand Information</h3>
          <div className="mt-4 rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Brand Assets</h4>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {domain.brandfetch.data.name && (
                <p>Brand Name: {domain.brandfetch.data.name}</p>
              )}
              {domain.brandfetch.data.description && (
                <p className="line-clamp-2">Description: {domain.brandfetch.data.description}</p>
              )}
              {domain.brandfetch.data.colors && domain.brandfetch.data.colors.length > 0 && (
                <div className="mt-2">
                  <p>Brand Colors:</p>
                  <div className="mt-1 flex gap-2">
                    {domain.brandfetch.data.colors.map((color, index) => (
                      <div
                        key={index}
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: color.hex }}
                        title={color.type}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-75 p-4 overflow-y-auto" onClick={closeModal}>
          <div 
            className="relative max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Full screenshot" 
              className="w-full h-auto max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
} 