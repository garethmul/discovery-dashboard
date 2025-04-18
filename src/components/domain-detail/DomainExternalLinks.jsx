import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ExternalLink, Search, RefreshCw } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Progress } from "../ui/progress";

export default function DomainExternalLinks({ domain }) {
  const [externalLinks, setExternalLinks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLinks, setFilteredLinks] = useState(null);

  const fetchExternalLinks = async () => {
    if (!domain?.domainId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching external links for domain ID: ${domain.domainId}`);
      const response = await axios.get(`/api/external-links/${domain.domainId}`);
      
      const data = response.data;
      console.log('External links data:', data);
      
      setExternalLinks(data);
      
      // Create a more usable links array from the details if available
      const detailsArray = data.details || [];
      const formattedLinks = detailsArray.map(detail => ({
        url: detail.target_url,
        text: detail.link_text,
        context: detail.element_html,
        page_url: detail.source_url
      }));
      
      setFilteredLinks(formattedLinks);
    } catch (err) {
      console.error('Error fetching external links:', err);
      setError('Failed to load external links data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalLinks();
  }, [domain?.domainId]);

  useEffect(() => {
    if (!externalLinks?.details) return;
    
    if (!searchTerm.trim()) {
      // Recreate formatted links array when no search is active
      const detailsArray = externalLinks.details || [];
      const formattedLinks = detailsArray.map(detail => ({
        url: detail.target_url,
        text: detail.link_text,
        context: detail.element_html,
        page_url: detail.source_url
      }));
      
      setFilteredLinks(formattedLinks);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    // Filter from the original details data
    const filteredDetails = externalLinks.details.filter(detail => 
      detail.target_url.toLowerCase().includes(term) || 
      detail.link_text?.toLowerCase().includes(term) || 
      detail.element_html?.toLowerCase().includes(term)
    );
    
    // Convert filtered details to our formatted links format
    const formattedLinks = filteredDetails.map(detail => ({
      url: detail.target_url,
      text: detail.link_text,
      context: detail.element_html,
      page_url: detail.source_url
    }));
    
    setFilteredLinks(formattedLinks);
  }, [searchTerm, externalLinks]);

  const renderDomainsSection = () => {
    const domains = externalLinks?.summary || [];
    
    if (domains.length === 0) {
      return (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No linked domains found</AlertTitle>
          <AlertDescription>No external domains are linked from this website.</AlertDescription>
        </Alert>
      );
    }

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Linked Domains</CardTitle>
          <CardDescription>External domains linked from this website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain, index) => (
              <Badge 
                key={index} 
                variant={domain.link_count > 10 ? "default" : "outline"}
                className="flex items-center gap-1"
              >
                {domain.external_domain} <span className="text-xs">({domain.link_count})</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLinksTable = () => {
    if (!filteredLinks || filteredLinks.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No external links found</AlertTitle>
          <AlertDescription>No external links were found on this website{searchTerm ? " matching your search" : ""}.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>URL</TableHead>
              <TableHead className="hidden md:table-cell">Link Text</TableHead>
              <TableHead className="hidden lg:table-cell">Context</TableHead>
              <TableHead className="hidden lg:table-cell">Page</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks.map((link, index) => (
              <TableRow key={index}>
                <TableCell className="max-w-[200px] truncate">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {link.url.replace(/^https?:\/\//, '')} <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {link.text || <span className="text-muted-foreground text-sm italic">No text</span>}
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                  {link.context || <span className="text-muted-foreground text-sm italic">No context</span>}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {link.page_url ? (
                    <a 
                      href={link.page_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {new URL(link.page_url).pathname}
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm italic">Unknown page</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderStats = () => {
    if (!externalLinks) return null;
    
    const totalLinks = externalLinks.details?.length || 0;
    const uniqueDomains = externalLinks.summary?.length || 0;
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalLinks}</div>
            <p className="text-xs text-muted-foreground">Total External Links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{uniqueDomains}</div>
            <p className="text-xs text-muted-foreground">Unique Domains</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      <Progress value={60} className="w-full max-w-md" />
      <p className="text-sm text-muted-foreground">Loading external links data...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">External Links</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchExternalLinks}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
      
      {loading ? (
        renderLoadingState()
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {renderStats()}
          
          {renderDomainsSection()}
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>External Links</CardTitle>
              <CardDescription>All external links found on this website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search links..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {renderLinksTable()}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 