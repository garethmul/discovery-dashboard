import React, { useState } from "react";
import { AlertTriangle, FileText, ChevronRight, ExternalLink, Globe, FolderTree } from "lucide-react";

export default function DomainSiteStructure({ domain }) {
  const [expandedUrls, setExpandedUrls] = useState({});

  if (!domain) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Data Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No information has been crawled for this domain.
        </p>
      </div>
    );
  }

  // Get pages from different possible locations in the API response
  const pages = domain.pages || domain.site_structure?.pages || [];
  
  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FolderTree className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Site Structure Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No pages have been crawled for this domain yet.
        </p>
      </div>
    );
  }
  
  // Sort pages by URL path depth for better structure display
  const sortedPages = [...pages].sort((a, b) => {
    // Get URL paths without domain and protocol
    const urlA = a.url.replace(/^https?:\/\/[^\/]+/, '');
    const urlB = b.url.replace(/^https?:\/\/[^\/]+/, '');
    // Count slashes to determine path depth
    const depthA = (urlA.match(/\//g) || []).length;
    const depthB = (urlB.match(/\//g) || []).length;
    
    // Sort by depth first, then alphabetically
    if (depthA !== depthB) return depthA - depthB;
    return urlA.localeCompare(urlB);
  });

  // Group pages by path segments to create a tree structure
  const pageTree = {};
  
  sortedPages.forEach(page => {
    // Parse URL to get path segments
    try {
      const url = new URL(page.url);
      const pathSegments = url.pathname.split('/').filter(Boolean);
      
      // Insert into tree
      let currentLevel = pageTree;
      
      if (pathSegments.length === 0) {
        // This is the homepage
        currentLevel['Homepage'] = { 
          url: page.url, 
          title: page.title || 'Homepage',
          statusCode: page.statusCode,
          children: currentLevel['Homepage']?.children || {} 
        };
      } else {
        // Create path segments
        pathSegments.forEach((segment, index) => {
          currentLevel[segment] = currentLevel[segment] || {};
          
          if (index === pathSegments.length - 1) {
            // This is the leaf node (actual page)
            currentLevel[segment] = {
              url: page.url,
              title: page.title || segment,
              statusCode: page.statusCode,
              children: currentLevel[segment].children || {}
            };
          } else {
            // This is an intermediate node (directory)
            currentLevel[segment].children = currentLevel[segment].children || {};
            currentLevel = currentLevel[segment].children;
          }
        });
      }
    } catch (e) {
      console.error('Error parsing URL:', page.url, e);
    }
  });

  const toggleExpand = (url) => {
    setExpandedUrls(prev => ({
      ...prev,
      [url]: !prev[url]
    }));
  };

  const renderPageTree = (node, level = 0, parentPath = '') => {
    if (!node) return null;
    
    // Handle leaf nodes (actual pages)
    if (node.url) {
      const isExpanded = expandedUrls[node.url] || false;
      const hasChildren = Object.keys(node.children || {}).length > 0;
      
      return (
        <div key={node.url} className="mb-1">
          <div 
            className={`flex items-center py-1 px-2 rounded hover:bg-muted ${level === 0 ? 'bg-muted/50 font-medium' : ''}`}
            style={{ marginLeft: `${level * 16}px` }}
          >
            {hasChildren && (
              <button onClick={() => toggleExpand(node.url)} className="mr-1 flex items-center justify-center">
                <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            
            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
            
            <div className="flex-1 truncate">
              <span title={node.title || node.url}>{node.title || node.url}</span>
            </div>
            
            <div className="flex items-center">
              {node.statusCode && (
                <span 
                  className={`text-xs px-1.5 py-0.5 rounded font-medium mr-2 ${
                    node.statusCode >= 200 && node.statusCode < 300 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : node.statusCode >= 300 && node.statusCode < 400
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {node.statusCode}
                </span>
              )}
              
              <a 
                href={node.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary/90"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          
          {isExpanded && hasChildren && (
            <div>
              {Object.entries(node.children).map(([key, childNode]) => 
                renderPageTree(childNode, level + 1, parentPath + '/' + key)
              )}
            </div>
          )}
        </div>
      );
    }
    
    // Handle directory nodes
    return (
      <div key={parentPath + '/' + level}>
        {Object.entries(node).map(([key, childNode]) => 
          renderPageTree(childNode, level, parentPath + '/' + key)
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Site Structure</h3>
        <div className="text-sm text-muted-foreground">
          {pages.length} pages crawled
        </div>
      </div>
      
      <div className="rounded-lg border">
        <div className="p-2">
          {renderPageTree(pageTree)}
        </div>
      </div>
    </div>
  );
} 