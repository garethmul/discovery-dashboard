import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDomainById } from "../../services/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { cn } from "../../lib/utils";
import { AlertCircle, Calendar, FileText, Globe, LayoutGrid, MessageSquare, Server, Headphones, Share2, ImageIcon, Palette, Book, Code, Youtube } from "lucide-react";
import DomainGeneralInfo from "./DomainGeneralInfo";
import DomainMetadata from "./DomainMetadata";
import DomainSiteStructure from "./DomainSiteStructure";
import DomainBlogContent from "./DomainBlogContent";
import DomainAiAnalysis from "./DomainAiAnalysis";
import DomainPodcasts from "./DomainPodcasts";
import DomainSocialProfiles from "./DomainSocialProfiles";
import DomainImages from "./DomainImages";
import DomainBrandInfo from "./DomainBrandInfo";
import DomainBooks from "./DomainBooks";
import DomainSchema from "./DomainSchema";
import DomainYoutube from "./DomainYoutube";
import { Button } from "../ui/button";

export default function DomainDetailPage() {
  const { id } = useParams();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasYoutubeData, setHasYoutubeData] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    async function fetchDomain() {
      try {
        setLoading(true);
        console.log('Fetching domain with ID:', id);
        const data = await getDomainById(id);
        console.log('Domain data received:', data);
        setDomain(data);
      } catch (error) {
        console.error("Error fetching domain:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDomain();
    }
  }, [id]);

  useEffect(() => {
    // Check if there's YouTube data for this domain
    async function checkYoutubeData() {
      if (!domain?.domainId) return;
      
      try {
        const response = await fetch(`/api/youtube/${domain.domainId}`);
        if (response.ok) {
          setHasYoutubeData(true);
        }
      } catch (error) {
        console.error("Error checking YouTube data:", error);
        setHasYoutubeData(false);
      }
    }
    
    checkYoutubeData();
  }, [domain?.domainId]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
        <h2 className="mt-4 text-xl font-bold text-destructive">Error Loading Domain</h2>
        <p className="mt-2 text-muted-foreground">
          {error?.message || "Domain not found or failed to load."}
        </p>
        <button
          onClick={() => navigate("/domains")}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Return to Domains List
        </button>
      </div>
    );
  }

  // Get domain name from various possible fields
  const domainName = domain.domainName || domain.domain || domain.url || domain.name || "Unknown Domain";
  
  // Debug logging for podcast data
  console.log('Checking podcast data:', {
    directPodcasts: domain.podcasts,
    dataPodcasts: domain.data?.podcasts,
    episodes: domain.data?.podcasts?.episodes?.length,
    feeds: domain.data?.podcasts?.feeds?.length
  });
  
  // Determine if certain data sections exist for tab display
  const hasPodcasts = domain.data?.podcasts?.episodes?.length > 0 || domain.data?.podcasts?.feeds?.length > 0;
  console.log('Has podcasts:', hasPodcasts);
  
  const hasBlog = domain.blog?.articles?.length > 0 || domain.blog?.hasBlog === true;
  const hasStructure = domain.pages?.length > 0 || domain.site_structure;
  const hasAiAnalysis = domain.aiAnalysis;
  const hasSocialProfiles = domain.opengraph && domain.opengraph.filter(item => item.isSocialProfile || item.type === 'social_profile').length > 0;
  const hasBrandData = domain?.brandfetch;
  const hasBooks = (domain.data?.books?.isbns?.length > 0 || domain.data?.books?.isbnImages?.length > 0);
  
  // Determine if images are available
  const hasImages = domain.media?.images?.all?.length > 0 || 
                   (domain.media?.images && Object.keys(domain.media.images).some(key => 
                     Array.isArray(domain.media.images[key]) && domain.media.images[key].length > 0
                   ));

  // Add this check to detect if schema markup data is available
  const hasSchemaMarkup = domain?.schemaMarkup && domain.schemaMarkup.length > 0;

  const tabs = [
    {
      id: "general",
      label: "General Info",
      icon: Globe,
      content: <DomainGeneralInfo domain={domain} />,
      hidden: false,
    },
    {
      id: "metadata",
      label: "Metadata",
      icon: FileText,
      content: <DomainMetadata domain={domain} />,
      hidden: false,
    },
    {
      id: "schema",
      label: "Schema",
      icon: Code,
      content: <DomainSchema schemaMarkup={domain?.schemaMarkup || []} />,
      hidden: !hasSchemaMarkup,
    },
    {
      id: "brand",
      label: "Brand",
      icon: Palette,
      content: <DomainBrandInfo domain={domain} />,
      hidden: !hasBrandData,
    },
    {
      id: "images",
      label: "Images",
      icon: ImageIcon,
      content: <DomainImages domain={domain} />,
      hidden: !hasImages,
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: Youtube,
      content: <DomainYoutube domain={domain} />,
      hidden: !hasYoutubeData,
    },
    {
      id: "books",
      label: "Books",
      icon: Book,
      content: <DomainBooks domain={domain} />,
      hidden: !hasBooks,
    },
    {
      id: "structure",
      label: "Site Structure",
      icon: LayoutGrid,
      content: <DomainSiteStructure domain={domain} />,
      hidden: !hasStructure,
    },
    {
      id: "social",
      label: "Social Profiles",
      icon: Share2,
      content: <DomainSocialProfiles domain={domain} />,
      hidden: !hasSocialProfiles,
    },
    {
      id: "blog",
      label: "Blog Content",
      icon: Calendar,
      content: <DomainBlogContent domain={domain} />,
      hidden: !hasBlog,
    },
    {
      id: "podcasts",
      label: "Podcasts",
      icon: Headphones,
      content: <DomainPodcasts domain={domain} />,
      hidden: !hasPodcasts,
    },
    {
      id: "ai-analysis",
      label: "AI Analysis",
      icon: Server,
      content: <DomainAiAnalysis domain={domain} />,
      hidden: !hasAiAnalysis,
    },
  ];

  // Function to get status badge color and text
  const getStatusBadge = (domain) => {
    // If we have the limited API data
    if (domain.isFromApi) {
      const hasBeenCrawled = domain.lastScraped != null;
      return {
        color: hasBeenCrawled ? "bg-green-500 text-white" : "bg-amber-100 text-amber-800",
        text: hasBeenCrawled ? "Completed" : "Not Crawled",
      };
    }

    // Based on status field
    const status = domain.status || domain.crawlProgress?.status || "unknown";
    
    switch (status.toLowerCase()) {
      case "complete":
      case "completed":
        return {
          color: "bg-green-500 text-white",
          text: "Completed",
        };
      case "in_progress":
      case "crawling":
        return {
          color: "bg-blue-500 text-white",
          text: "In Progress",
        };
      case "failed":
      case "error":
        return {
          color: "bg-red-500 text-white",
          text: "Failed",
        };
      case "pending":
        return {
          color: "bg-amber-100 text-amber-800",
          text: "Pending",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          text: "Unknown",
        };
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{domainName}</h1>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(domain).color}`}>
              {getStatusBadge(domain).text}
            </span>
            {domain.lastScraped && (
              <span className="text-xs text-muted-foreground">
                Last crawled: {new Date(domain.lastScraped).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <div className="hidden md:block">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const hasData = !tab.hidden;
              return (
                <button
                  key={tab.id}
                  onClick={() => hasData && setActiveTab(tab.id)}
                  disabled={!hasData}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    activeTab === tab.id
                      ? "bg-muted font-medium text-primary"
                      : hasData
                        ? "text-muted-foreground hover:bg-muted" 
                        : "text-muted-foreground/40 cursor-not-allowed",
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", !hasData && "opacity-40")} />
                  {tab.label}
                  {!hasData && (
                    <span className="ml-auto text-xs italic text-muted-foreground/40">No data</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="md:hidden">
          <div className="w-full overflow-auto">
            <div className="flex items-center space-x-2 border-b pb-2">
              {tabs.map((tab) => {
                const hasData = !tab.hidden;
                return (
                  <button
                    key={tab.id}
                    onClick={() => hasData && setActiveTab(tab.id)}
                    disabled={!hasData}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-all",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : hasData
                          ? "text-foreground hover:bg-muted"
                          : "text-muted-foreground/40 cursor-not-allowed",
                    )}
                  >
                    <tab.icon className={cn("h-4 w-4", !hasData && "opacity-40")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="p-6">
            {tabs.map((tab) => (
              activeTab === tab.id ? (tab.hidden ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <tab.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No data available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This domain doesn't have any {tab.label.toLowerCase()} data available.
                  </p>
                </div>
              ) : tab.content) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 