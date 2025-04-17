import React, { useState, useEffect } from "react";
import api, { getDomainSeoData } from "../../services/api";
import { Search, ChevronDown, ChevronUp, ArrowDownUp, BarChart2, Hash, TrendingUp, DollarSign, MessageSquare, Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

function formatNumber(num) {
  if (!num && num !== 0) return "-";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function calculatePositionChange(position, previousPosition) {
  if (!previousPosition) return null;
  
  const change = previousPosition - position;
  if (change > 0) return { value: change, improved: true };
  if (change < 0) return { value: Math.abs(change), improved: false };
  return { value: 0, improved: null };
}

export default function DomainSEO({ domain }) {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ field: 'position', direction: 'asc' });
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [positionFilter, setPositionFilter] = useState(null);
  
  useEffect(() => {
    async function fetchSeoData() {
      if (!domain?.domainId) return;
      
      setLoading(true);
      try {
        const data = await getDomainSeoData(domain.domainId);
        setSeoData(data);
        setFilteredKeywords(data.keywords || []);
      } catch (err) {
        console.error("Error fetching SEO data:", err);
        setError(err.message || "Failed to load SEO data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchSeoData();
  }, [domain?.domainId]);
  
  useEffect(() => {
    if (!seoData?.keywords) return;
    
    // Apply search filter
    let keywords = [...seoData.keywords];
    
    // Apply position filter
    if (positionFilter) {
      switch(positionFilter) {
        case 'top3':
          keywords = keywords.filter(kw => kw.position <= 3);
          break;
        case 'top10':
          keywords = keywords.filter(kw => kw.position <= 10);
          break;
        case 'top20':
          keywords = keywords.filter(kw => kw.position <= 20);
          break;
        case 'top50':
          keywords = keywords.filter(kw => kw.position <= 50);
          break;
        case 'below50':
          keywords = keywords.filter(kw => kw.position > 50);
          break;
      }
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      keywords = keywords.filter(
        kw => kw.keyword?.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    keywords.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];
      
      // For numeric values (position, search_volume, etc.)
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // For competition score, which is a decimal
      if (sortConfig.field === 'competition') {
        return sortConfig.direction === 'asc' 
          ? parseFloat(aValue || 0) - parseFloat(bValue || 0) 
          : parseFloat(bValue || 0) - parseFloat(aValue || 0);
      }
      
      // For CPC, which is a decimal
      if (sortConfig.field === 'cpc') {
        return sortConfig.direction === 'asc' 
          ? parseFloat(aValue || 0) - parseFloat(bValue || 0) 
          : parseFloat(bValue || 0) - parseFloat(aValue || 0);
      }
      
      // For strings
      aValue = String(aValue || '');
      bValue = String(bValue || '');
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
    
    setFilteredKeywords(keywords);
  }, [seoData, searchTerm, sortConfig, positionFilter]);
  
  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredKeywords.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedKeywords = filteredKeywords.slice(startIndex, startIndex + itemsPerPage);
  
  // Get position badge color
  const getPositionBadgeColor = (position) => {
    if (position <= 3) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (position <= 10) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (position <= 20) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"; 
    if (position <= 50) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };
  
  // Calculate estimated traffic for top 20 keywords based on position CTR curve
  const calculateEstimatedTraffic = () => {
    if (!seoData?.keywords) return 0;
    
    // Approximate CTR by position
    const ctrByPosition = {
      1: 0.3, 2: 0.15, 3: 0.1,
      4: 0.08, 5: 0.06, 6: 0.05,
      7: 0.04, 8: 0.03, 9: 0.025, 10: 0.02,
      11: 0.01, 12: 0.008, 13: 0.007, 14: 0.006, 
      15: 0.005, 16: 0.004, 17: 0.003, 18: 0.002, 
      19: 0.001, 20: 0.001
    };
    
    return seoData.keywords
      .filter(kw => kw.position <= 20)
      .reduce((total, kw) => {
        const ctr = ctrByPosition[kw.position] || 0;
        return total + (kw.search_volume || 0) * ctr;
      }, 0);
  };
  
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
  
  if (!seoData || !seoData.keywords || seoData.keywords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <BarChart2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No SEO data</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This domain doesn't have any SEO keyword data available.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* SEO summary stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Keywords</div>
          <div className="mt-1 text-2xl font-bold">{seoData.statistics.total_keywords}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Top 10 Keywords</div>
          <div className="mt-1 text-2xl font-bold">{seoData.statistics.top10_count}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Average Position</div>
          <div className="mt-1 text-2xl font-bold">{seoData.statistics.average_position.toFixed(1)}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Est. Monthly Traffic</div>
          <div className="mt-1 text-2xl font-bold">{formatNumber(Math.round(calculateEstimatedTraffic()))}</div>
        </div>
      </div>
      
      {/* Position distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Position Distribution
          </CardTitle>
          <CardDescription>
            Keyword rankings across different position ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div 
              className="rounded-md border py-3 cursor-pointer hover:bg-muted"
              onClick={() => setPositionFilter(positionFilter === 'top3' ? null : 'top3')}
            >
              <div className="text-lg font-bold text-green-600">{seoData.statistics.top3_count}</div>
              <div className="text-sm text-muted-foreground">Top 3</div>
            </div>
            <div
              className="rounded-md border py-3 cursor-pointer hover:bg-muted"
              onClick={() => setPositionFilter(positionFilter === 'top10' ? null : 'top10')}
            >
              <div className="text-lg font-bold text-blue-600">{seoData.statistics.top10_count}</div>
              <div className="text-sm text-muted-foreground">Top 10</div>
            </div>
            <div
              className="rounded-md border py-3 cursor-pointer hover:bg-muted"
              onClick={() => setPositionFilter(positionFilter === 'top20' ? null : 'top20')}
            >
              <div className="text-lg font-bold text-yellow-600">{seoData.statistics.top20_count}</div>
              <div className="text-sm text-muted-foreground">Top 20</div>
            </div>
            <div
              className="rounded-md border py-3 cursor-pointer hover:bg-muted"
              onClick={() => setPositionFilter(positionFilter === 'top50' ? null : 'top50')}
            >
              <div className="text-lg font-bold text-orange-600">{seoData.statistics.top50_count}</div>
              <div className="text-sm text-muted-foreground">Top 50</div>
            </div>
            <div
              className="rounded-md border py-3 cursor-pointer hover:bg-muted"
              onClick={() => setPositionFilter(positionFilter === 'below50' ? null : 'below50')}
            >
              <div className="text-lg font-bold text-red-600">{seoData.statistics.below50_count}</div>
              <div className="text-sm text-muted-foreground">Below 50</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Most valuable keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Most Valuable Keywords
          </CardTitle>
          <CardDescription>
            Keywords with highest potential business value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="pb-2 text-left">Keyword</th>
                  <th className="pb-2 text-center">Position</th>
                  <th className="pb-2 text-center">Volume</th>
                  <th className="pb-2 text-center">CPC</th>
                  <th className="pb-2 text-center">Value</th>
                </tr>
              </thead>
              <tbody>
                {seoData.most_valuable_keywords?.slice(0, 5).map((kw, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm">{kw.keyword}</td>
                    <td className="py-2 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPositionBadgeColor(kw.position)}`}>
                        {kw.position}
                      </span>
                    </td>
                    <td className="py-2 text-center text-sm">{formatNumber(kw.search_volume)}</td>
                    <td className="py-2 text-center text-sm">${kw.cpc}</td>
                    <td className="py-2 text-center text-sm">${kw.estimated_value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* All Keywords section title */}
      <div className="flex items-center">
        <MessageSquare className="mr-2 h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">All Keywords ({filteredKeywords.length})</h3>
        {positionFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 h-8 text-xs"
            onClick={() => setPositionFilter(null)}
          >
            Clear filter
          </Button>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search keywords..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Hash className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">{itemsPerPage} per page</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[10, 25, 50, 100].map((count) => (
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
          variant={sortConfig.field === 'position' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('position')}
          className="flex items-center gap-1"
        >
          <BarChart2 className="h-4 w-4" />
          Position
          {sortConfig.field === 'position' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'keyword' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('keyword')}
          className="flex items-center gap-1"
        >
          <ArrowDownUp className="h-4 w-4" />
          Keyword
          {sortConfig.field === 'keyword' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'search_volume' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('search_volume')}
          className="flex items-center gap-1"
        >
          <TrendingUp className="h-4 w-4" />
          Volume
          {sortConfig.field === 'search_volume' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'cpc' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('cpc')}
          className="flex items-center gap-1"
        >
          <DollarSign className="h-4 w-4" />
          CPC
          {sortConfig.field === 'cpc' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'competition' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('competition')}
          className="flex items-center gap-1"
        >
          <Globe className="h-4 w-4" />
          Competition
          {sortConfig.field === 'competition' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Keywords list */}
      {paginatedKeywords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left">Keyword</th>
                <th className="p-2 text-center">Position</th>
                <th className="p-2 text-center">Previous</th>
                <th className="p-2 text-center">Change</th>
                <th className="p-2 text-center">Volume</th>
                <th className="p-2 text-center">CPC</th>
                <th className="p-2 text-center">Competition</th>
                <th className="p-2 text-left">URL</th>
              </tr>
            </thead>
            <tbody>
              {paginatedKeywords.map((keyword, index) => {
                const positionChange = calculatePositionChange(keyword.position, keyword.previous_position);
                
                return (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{keyword.keyword}</td>
                    <td className="p-2 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPositionBadgeColor(keyword.position)}`}>
                        {keyword.position}
                      </span>
                    </td>
                    <td className="p-2 text-center text-sm">
                      {keyword.previous_position || "-"}
                    </td>
                    <td className="p-2 text-center text-sm">
                      {positionChange ? (
                        <span className={`flex items-center justify-center ${positionChange.improved ? 'text-green-600' : 'text-red-600'}`}>
                          {positionChange.improved ? "↑" : "↓"} {positionChange.value}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="p-2 text-center text-sm">{formatNumber(keyword.search_volume)}</td>
                    <td className="p-2 text-center text-sm">${keyword.cpc || "-"}</td>
                    <td className="p-2 text-center text-sm">
                      {keyword.competition ? (keyword.competition * 100).toFixed(0) + "%" : "-"}
                    </td>
                    <td className="p-2 text-sm max-w-[200px] truncate">
                      {keyword.url ? (
                        <a 
                          href={keyword.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate block"
                        >
                          {keyword.url.replace(/^https?:\/\//, '')}
                        </a>
                      ) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-center">
          <div className="max-w-md rounded-lg border p-6">
            <BarChart2 className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No keywords found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || positionFilter ? "Try adjusting your search or position filters." : "No SEO keywords available for this domain."}
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
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
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