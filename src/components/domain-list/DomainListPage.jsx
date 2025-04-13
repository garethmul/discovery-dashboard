import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDomains } from "../../services/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Filter, Calendar, Globe, ArrowUpDown } from "lucide-react";

export default function DomainListPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("domain");
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract search query from URL if present
    const params = new URLSearchParams(location.search);
    const searchFromUrl = params.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    async function fetchDomains() {
      try {
        setLoading(true);
        const data = await getDomains(searchQuery);
        console.log('Domain data received:', data);
        
        // Additional debug logging for domain properties
        if (Array.isArray(data) && data.length > 0) {
          console.log('First domain properties:', {
            id: data[0].domainId || data[0].id || data[0]._id,
            name: data[0].domainName || data[0].domain || data[0].url || data[0].name,
            status: data[0].status || data[0].crawlProgress?.status,
            lastCrawled: data[0].lastScraped || data[0].lastCrawled || data[0].crawlProgress?.lastActive,
            pageCount: data[0].pages?.length || data[0].page_count || data[0].crawlProgress?.pagesTotal
          });
        }
        
        setDomains(data);
      } catch (error) {
        console.error("Error fetching domains:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDomains();
  }, [searchQuery]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedDomains = [...domains].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // For dates
    if (sortField === "last_crawled" || sortField === "created_at") {
      return sortDirection === "asc"
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    // For numbers
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not crawled yet";
    
    const date = new Date(dateString);
    // Check if date is invalid
    if (isNaN(date.getTime())) return "Invalid date";
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Domains</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search domains..."
              className="w-full pl-8 sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-destructive">Error loading domains: {error.message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : domains.length === 0 ? (
        <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-dashed p-6">
          <Globe className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Domains Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery
              ? `No domains matching "${searchQuery}"`
              : "No domains have been crawled yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="overflow-auto">
            <table className="w-full min-w-[800px] caption-bottom text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th 
                    className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                    onClick={() => handleSort("domain")}
                  >
                    <div className="flex items-center gap-2">
                      Domain
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th 
                    className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                    onClick={() => handleSort("page_count")}
                  >
                    <div className="flex items-center gap-2">
                      Pages
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                    onClick={() => handleSort("last_crawled")}
                  >
                    <div className="flex items-center gap-2">
                      Last Crawled
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDomains.map((domain, index) => {
                  // Extract domain data
                  const domainName = domain.domain_name || domain.domainName || domain.domain || domain.url || domain.name || "Unknown Domain";
                  const lastCrawled = domain.last_scraped_at || domain.lastScraped || domain.lastCrawled || domain.crawlProgress?.lastActive || domain.last_crawled;

                  // Determine status based on last_scraped_at - if null, it's pending, otherwise completed
                  const domainStatus = domain.domain_name ? (domain.last_scraped_at ? "complete" : "pending") : (lastCrawled ? "complete" : "pending");

                  // Page count - if the domain was never crawled, we display a message instead of 0
                  const pageCount = domain.page_count || domain.pages?.length || domain.crawlProgress?.pagesTotal || 0;

                  const hasMetadata = domain.metadata && Object.keys(domain.metadata).length > 0;
                  const hasPodcasts = domain.podcasts?.episodes?.length > 0 || domain.podcasts?.feeds?.length > 0;
                  const podcastCount = domain.podcasts?.episodes?.length || 0;

                  return (
                    <tr
                      key={domain.id || domain.domainId || domain._id || index}
                      className="border-b transition-colors hover:bg-muted/50"
                      onClick={() => navigate(`/domains/${domain.id || domain.domainId || domain._id || index}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span className="font-medium">{domainName}</span>
                          </div>
                          {domain.metadata?.title && domain.metadata.title !== domainName && (
                            <span className="mt-1 text-xs text-muted-foreground line-clamp-1">{domain.metadata.title}</span>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hasMetadata && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Metadata
                              </span>
                            )}
                            {hasPodcasts && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                Podcasts
                              </span>
                            )}
                            {domain.opengraph && domain.opengraph.length > 0 && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900 dark:text-green-300">
                                Social
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              domainStatus === "completed" || domainStatus === "complete"
                                ? "bg-green-500"
                                : domainStatus === "in_progress"
                                ? "bg-blue-500"
                                : domainStatus === "failed" || domainStatus === "error"
                                ? "bg-red-500" 
                                : "bg-amber-500"
                            }`}
                          />
                          <span className="capitalize">
                            {lastCrawled ? "Completed" : "Not crawled yet"}
                          </span>
                        </div>
                        {domain.crawlProgress && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Progress: {domain.crawlProgress.pagesCrawled || 0}/{domain.crawlProgress.pagesTotal || 0}
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          {pageCount > 0 ? (
                            <span className="font-medium">{pageCount}</span>
                          ) : (
                            <span className="text-muted-foreground text-sm">No pages crawled</span>
                          )}
                          {podcastCount > 0 && (
                            <span className="mt-1 text-xs text-muted-foreground">
                              {podcastCount} podcast episode{podcastCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {domain.media?.images?.all?.length > 0 && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                              {domain.media.images.all.length} images
                            </span>
                          )}
                          {!domain.media?.images?.all?.length && domain.media?.images && (() => {
                            const imageCount = Object.entries(domain.media.images)
                              .filter(([key, val]) => 
                                Array.isArray(val) && 
                                val.length > 0 && 
                                (key.includes('Images') || key === 'all')
                              )
                              .reduce((total, [_, arr]) => total + arr.length, 0);
                            
                            return imageCount > 0 ? (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                {imageCount} images
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(lastCrawled)}</span>
                        </div>
                        {domain.crawlTracking && domain.crawlTracking.length > 0 && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Crawl count: {domain.crawlTracking[0].crawlCount || 0}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right align-middle">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/domains/${domain.id || domain.domainId || domain._id || index}`);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 