import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDomains } from "../../services/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Search, Filter, Calendar, Globe, ArrowUpDown, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function DomainListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract search query from URL for initial state
  const params = new URLSearchParams(location.search);
  const initialSearchQuery = params.get("search") || "";
  
  // Get sort preferences from localStorage or use defaults
  const getSavedSortPreference = () => {
    const savedSortField = localStorage.getItem("domainListSortField");
    const savedSortDirection = localStorage.getItem("domainListSortDirection");
    return {
      sortField: savedSortField || "domain_name",
      sortDirection: savedSortDirection || "asc"
    };
  };
  
  const sortPreference = getSavedSortPreference();
  
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [localSearchValue, setLocalSearchValue] = useState(initialSearchQuery);
  const [sortField, setSortField] = useState(sortPreference.sortField);
  const [sortDirection, setSortDirection] = useState(sortPreference.sortDirection);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Only need to watch for URL search param changes after initial mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromUrl = params.get("search") || "";
    
    // Only update if the search param changed and is different from current state
    if (searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
      setLocalSearchValue(searchFromUrl);
      setPage(0); // Reset to first page
    }
  }, [location.search, searchQuery]);

  useEffect(() => {
    async function fetchDomains() {
      try {
        setLoading(true);
        const result = await getDomains(
          searchQuery,
          page,
          itemsPerPage,
          sortField,
          sortDirection
        );
        console.log('Domain data received:', result);
        
        // Additional debug logging for domain properties
        if (Array.isArray(result.domains) && result.domains.length > 0) {
          console.log('First domain properties:', {
            id: result.domains[0].domainId || result.domains[0].id || result.domains[0]._id,
            name: result.domains[0].domainName || result.domains[0].domain || result.domains[0].url || result.domains[0].name,
            status: result.domains[0].status || result.domains[0].crawlProgress?.status,
            lastCrawled: result.domains[0].lastScraped || result.domains[0].lastCrawled || result.domains[0].crawlProgress?.lastActive,
            pageCount: result.domains[0].pages?.length || result.domains[0].page_count || result.domains[0].crawlProgress?.pagesTotal
          });
        }
        
        setDomains(result.domains || []);
        setTotalCount(result.totalCount || 0);
        setTotalPages(result.totalPages || 0);
      } catch (error) {
        console.error("Error fetching domains:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDomains();
  }, [searchQuery, page, itemsPerPage, sortField, sortDirection]);

  const handleSort = (field) => {
    let newDirection = sortDirection;
    if (sortField === field) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
    } else {
      setSortField(field);
      newDirection = "asc";
      setSortDirection("asc");
    }
    
    // Save sort preferences to localStorage
    localStorage.setItem("domainListSortField", field);
    localStorage.setItem("domainListSortDirection", newDirection);
    
    // Reset to first page when sort changes
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not crawled yet";
    
    const date = new Date(dateString);
    // Check if date is invalid
    if (isNaN(date.getTime())) return "Invalid date";
    
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  const handlePageChange = (newPage) => {
    // Ensure page is within valid range
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setPage(0); // Reset to first page
  };
  
  // Create an array of page numbers to display in pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than max visible, show all pages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);
      
      // Calculate range around current page
      let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages - 2, startPage + maxVisiblePages - 3);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxVisiblePages - 3) {
        startPage = Math.max(1, endPage - (maxVisiblePages - 3));
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pageNumbers.push(-1); // -1 indicates ellipsis
      }
      
      // Add range of pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pageNumbers.push(-2); // -2 indicates ellipsis
      }
      
      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };

  // Update search input handler to sync with URL
  const handleSearchChange = (e) => {
    const newSearchValue = e.target.value;
    setLocalSearchValue(newSearchValue);
    
    // Update the URL with debounced search parameter
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    window.searchTimeout = setTimeout(() => {
      setSearchQuery(newSearchValue);
      const params = new URLSearchParams(location.search);
      if (newSearchValue) {
        params.set("search", newSearchValue);
      } else {
        params.delete("search");
      }
      
      // Replace the current URL to avoid creating multiple history entries
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 500); // 500ms debounce delay
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
              value={localSearchValue}
              onChange={handleSearchChange}
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
        <>
          <div className="rounded-md border">
            <div className="overflow-auto">
              <table className="w-full min-w-[800px] caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th 
                      className="h-10 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("domain_name")}
                    >
                      <div className="flex items-center gap-2">
                        Domain
                        <ArrowUpDown className={`h-4 w-4 ${sortField === "domain_name" ? "opacity-100" : "opacity-50"}`} />
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th 
                      className="h-10 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("page_count")}
                    >
                      <div className="flex items-center gap-2">
                        Pages
                        <ArrowUpDown className={`h-4 w-4 ${sortField === "page_count" ? "opacity-100" : "opacity-50"}`} />
                      </div>
                    </th>
                    <th 
                      className="h-10 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("last_scraped_at")}
                    >
                      <div className="flex items-center gap-2">
                        Last Crawled
                        <ArrowUpDown className={`h-4 w-4 ${sortField === "last_scraped_at" ? "opacity-100" : "opacity-50"}`} />
                      </div>
                    </th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((domain, index) => {
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
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {domains.length} of {totalCount} domains
              </span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="25" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">per page</span>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(0)} 
                    className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={page === 0}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(page - 1)} 
                    className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={page === 0}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNum, i) => (
                  <PaginationItem key={i}>
                    {pageNum < 0 ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum + 1}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(page + 1)} 
                    className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={page === totalPages - 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(totalPages - 1)} 
                    className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    aria-disabled={page === totalPages - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
} 