import React, { useState, useEffect } from "react";
import { getDomainSeoCompetitors } from "../../services/api";
import { Search, ChevronDown, ChevronUp, ArrowDownUp, BarChart2, Hash, TrendingUp, DollarSign, Users, Globe, ExternalLink, PieChart } from "lucide-react";
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

function formatCurrency(num) {
  if (!num && num !== 0) return "-";
  if (num >= 1000000) {
    return '$' + (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return '$' + (num / 1000).toFixed(1) + 'K';
  }
  return '$' + num.toFixed(2);
}

export default function DomainSEOCompetitors({ domain }) {
  const [competitorData, setCompetitorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ field: 'intersections', direction: 'desc' });
  const [filteredCompetitors, setFilteredCompetitors] = useState([]);
  
  useEffect(() => {
    async function fetchCompetitorData() {
      if (!domain?.domainId) return;
      
      setLoading(true);
      try {
        const data = await getDomainSeoCompetitors(domain.domainId);
        setCompetitorData(data);
        setFilteredCompetitors(data.competitors || []);
      } catch (err) {
        console.error("Error fetching SEO competitor data:", err);
        setError(err.message || "Failed to load SEO competitor data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompetitorData();
  }, [domain?.domainId]);
  
  useEffect(() => {
    if (!competitorData?.competitors) return;
    
    // Apply search filter
    let competitors = [...competitorData.competitors];
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      competitors = competitors.filter(comp => comp.domain_name?.toLowerCase().includes(search));
    }
    
    // Apply sorting
    competitors.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.field) {
        case 'domain_name':
          aValue = a.domain_name;
          bValue = b.domain_name;
          break;
        case 'avg_position':
          aValue = a.avg_position;
          bValue = b.avg_position;
          break;
        case 'intersections':
          aValue = a.intersections;
          bValue = b.intersections;
          break;
        case 'etv':
          aValue = a.metrics?.metrics_organic?.etv || 0;
          bValue = b.metrics?.metrics_organic?.etv || 0;
          break;
        case 'keywords':
          aValue = a.metrics?.metrics_organic?.count || 0;
          bValue = b.metrics?.metrics_organic?.count || 0;
          break;
        default:
          aValue = a[sortConfig.field];
          bValue = b[sortConfig.field];
      }
      
      // For numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // For strings
      aValue = String(aValue || '');
      bValue = String(bValue || '');
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
    
    setFilteredCompetitors(competitors);
  }, [competitorData, searchTerm, sortConfig]);
  
  const handleSort = (field) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCompetitors.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCompetitors = filteredCompetitors.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate position distribution for a competitor
  const calculatePositionDistribution = (metrics) => {
    if (!metrics?.metrics_organic) return [];
    
    const organic = metrics.metrics_organic;
    const total = organic.count || 1; // Prevent division by zero
    
    return [
      {
        label: 'Top 3',
        value: (organic.pos_1 || 0) + (organic.pos_2_3 || 0),
        percentage: (((organic.pos_1 || 0) + (organic.pos_2_3 || 0)) / total) * 100,
        color: 'bg-green-500'
      },
      {
        label: '4-10',
        value: organic.pos_4_10 || 0,
        percentage: ((organic.pos_4_10 || 0) / total) * 100,
        color: 'bg-blue-500'
      },
      {
        label: '11-20',
        value: organic.pos_11_20 || 0,
        percentage: ((organic.pos_11_20 || 0) / total) * 100,
        color: 'bg-yellow-500'
      },
      {
        label: '21-50',
        value: (organic.pos_21_30 || 0) + (organic.pos_31_40 || 0) + (organic.pos_41_50 || 0),
        percentage: (((organic.pos_21_30 || 0) + (organic.pos_31_40 || 0) + (organic.pos_41_50 || 0)) / total) * 100,
        color: 'bg-orange-500'
      },
      {
        label: '51-100',
        value: (organic.pos_51_60 || 0) + (organic.pos_61_70 || 0) + (organic.pos_71_80 || 0) + (organic.pos_81_90 || 0) + (organic.pos_91_100 || 0),
        percentage: (((organic.pos_51_60 || 0) + (organic.pos_61_70 || 0) + (organic.pos_71_80 || 0) + (organic.pos_81_90 || 0) + (organic.pos_91_100 || 0)) / total) * 100,
        color: 'bg-red-500'
      }
    ];
  };
  
  // Calculate keyword movement indicators
  const getKeywordMovement = (metrics) => {
    if (!metrics?.metrics_organic) return { new: 0, up: 0, down: 0, lost: 0 };
    
    const organic = metrics.metrics_organic;
    return {
      new: organic.is_new || 0,
      up: organic.is_up || 0,
      down: organic.is_down || 0,
      lost: organic.is_lost || 0
    };
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
  
  if (!competitorData || !competitorData.competitors || competitorData.competitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No SEO competitor data</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This domain doesn't have any SEO competitor data available.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* SEO competitor summary stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Competitors</div>
          <div className="mt-1 text-2xl font-bold">{competitorData.stats.total_competitors}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Intersections</div>
          <div className="mt-1 text-2xl font-bold">{formatNumber(competitorData.stats.total_intersections)}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Avg. Intersections/Competitor</div>
          <div className="mt-1 text-2xl font-bold">{formatNumber(competitorData.stats.avg_competitor_intersection)}</div>
        </div>
        <div className="rounded-md border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Estimated Traffic Value</div>
          <div className="mt-1 text-2xl font-bold">{formatCurrency(competitorData.stats.total_etv)}</div>
        </div>
      </div>
      
      {/* Top competitors overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Top Competitors Overview
          </CardTitle>
          <CardDescription>
            Domains competing for the same keywords in search results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="pb-2 text-left">Domain</th>
                  <th className="pb-2 text-center">Keywords</th>
                  <th className="pb-2 text-center">Intersections</th>
                  <th className="pb-2 text-center">Avg. Position</th>
                  <th className="pb-2 text-center">Est. Traffic Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitors.slice(0, 5).map((competitor, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-sm font-medium">
                      <a 
                        href={`https://${competitor.domain_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary hover:underline"
                      >
                        {competitor.domain_name}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-2 text-center text-sm">
                      {formatNumber(competitor.metrics?.metrics_organic?.count || 0)}
                    </td>
                    <td className="py-2 text-center text-sm">
                      {formatNumber(competitor.intersections)}
                    </td>
                    <td className="py-2 text-center text-sm">
                      {competitor.avg_position.toFixed(1)}
                    </td>
                    <td className="py-2 text-center text-sm">
                      {formatCurrency(competitor.metrics?.metrics_organic?.etv || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* All competitors section title */}
      <div className="flex items-center">
        <Globe className="mr-2 h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">All Competitors ({filteredCompetitors.length})</h3>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search competitors..."
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
              {[5, 10, 25, 50].map((count) => (
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
          variant={sortConfig.field === 'domain_name' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('domain_name')}
          className="flex items-center gap-1"
        >
          <Globe className="h-4 w-4" />
          Domain
          {sortConfig.field === 'domain_name' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'keywords' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('keywords')}
          className="flex items-center gap-1"
        >
          <Hash className="h-4 w-4" />
          Keywords
          {sortConfig.field === 'keywords' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'intersections' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('intersections')}
          className="flex items-center gap-1"
        >
          <ArrowDownUp className="h-4 w-4" />
          Intersections
          {sortConfig.field === 'intersections' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'avg_position' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('avg_position')}
          className="flex items-center gap-1"
        >
          <BarChart2 className="h-4 w-4" />
          Avg. Position
          {sortConfig.field === 'avg_position' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={sortConfig.field === 'etv' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSort('etv')}
          className="flex items-center gap-1"
        >
          <DollarSign className="h-4 w-4" />
          Traffic Value
          {sortConfig.field === 'etv' && (
            sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Competitors list */}
      {paginatedCompetitors.length > 0 ? (
        <div className="space-y-4">
          {paginatedCompetitors.map((competitor, index) => {
            const positionDistribution = calculatePositionDistribution(competitor.metrics);
            const keywordMovement = getKeywordMovement(competitor.metrics);
            
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="flex items-center text-lg">
                        <a 
                          href={`https://${competitor.domain_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          {competitor.domain_name}
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {formatNumber(competitor.metrics?.metrics_organic?.count || 0)} keywords • {formatNumber(competitor.intersections)} intersections
                      </CardDescription>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
                      <div className="text-xl font-bold">
                        {formatCurrency(competitor.metrics?.metrics_organic?.etv || 0)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">est. value</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg. position: <span className="font-semibold">{competitor.avg_position.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Position distribution */}
                    <div>
                      <h4 className="mb-2 text-sm font-medium flex items-center">
                        <PieChart className="mr-1 h-4 w-4 text-muted-foreground" />
                        Position Distribution
                      </h4>
                      <div className="h-4 rounded-full overflow-hidden flex">
                        {positionDistribution.map((pos, i) => (
                          <div 
                            key={i}
                            className={`${pos.color} h-full`} 
                            style={{width: `${pos.percentage}%`}}
                            title={`${pos.label}: ${pos.value} keywords (${pos.percentage.toFixed(1)}%)`}
                          />
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        {positionDistribution.map((pos, i) => (
                          <div key={i} className="flex items-center">
                            <div className={`${pos.color} h-2 w-2 rounded-full mr-1`} />
                            <span>{pos.label}: {formatNumber(pos.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Keyword movement */}
                    <div>
                      <h4 className="mb-2 text-sm font-medium flex items-center">
                        <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
                        Keyword Movement
                      </h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1" title="New keywords appearing in the top 100">
                          <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-medium">
                            +{formatNumber(keywordMovement.new)}
                          </div>
                          <span className="text-xs">New</span>
                        </div>
                        
                        <div className="flex items-center gap-1" title="Keywords that moved up in ranking">
                          <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium">
                            ↑{formatNumber(keywordMovement.up)}
                          </div>
                          <span className="text-xs">Improved</span>
                        </div>
                        
                        <div className="flex items-center gap-1" title="Keywords that moved down in ranking">
                          <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-medium">
                            ↓{formatNumber(keywordMovement.down)}
                          </div>
                          <span className="text-xs">Declined</span>
                        </div>
                        
                        <div className="flex items-center gap-1" title="Keywords that dropped out of the top 100">
                          <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs font-medium">
                            -{formatNumber(keywordMovement.lost)}
                          </div>
                          <span className="text-xs">Lost</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Traffic cost comparison */}
                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium flex items-center">
                      <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                      Estimated Monthly Value
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Organic</span>
                        <span className="font-bold">{formatCurrency(competitor.metrics?.metrics_organic?.etv || 0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Paid Equivalent</span>
                        <span className="font-bold">{formatCurrency(competitor.metrics?.metrics_organic?.estimated_paid_traffic_cost || 0)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-center">
          <div className="max-w-md rounded-lg border p-6">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No competitors found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search criteria." : "No SEO competitors available for this domain."}
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