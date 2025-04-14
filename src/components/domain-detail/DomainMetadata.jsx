import React from "react";
import { AlertTriangle, Globe, Info, Palette, BookOpen, Send } from "lucide-react";

export default function DomainMetadata({ domain }) {
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

  // Check for different metadata sources in the API response
  const metadata = domain.metadata || {};
  const opengraph = domain.opengraph || [];
  const colors = domain.colors || {};
  const colorSchemes = domain.colorSchemes || [];
  const brandAnalysis = domain.brandAnalysis || {};
  const contentCategories = domain.contentCategories || [];

  const renderMetadataSection = (title, data, keyMap = {}, icon = null) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3 flex items-center gap-2">
          {icon && React.cloneElement(icon, { className: "h-4 w-4" })}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <div className="p-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            {Object.entries(data).map(([key, value]) => {
              if (value === null || value === undefined || value === "") return null;
              const displayKey = keyMap[key] || key.replace(/_/g, " ");
              return (
                <div key={key} className="overflow-hidden">
                  <dt className="truncate text-sm font-medium capitalize text-muted-foreground">
                    {displayKey}
                  </dt>
                  <dd className="mt-1 break-words text-sm">
                    {typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    );
  };

  const renderListSection = (title, items, getKey = (item) => item.id, getContent = (item) => item, icon = null) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3 flex items-center gap-2">
          {icon && React.cloneElement(icon, { className: "h-4 w-4" })}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <div className="p-4">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li key={getKey(item) || index} className="rounded-md bg-muted p-2 text-sm">
                {getContent(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Helper function to render color box
  const renderColorBox = (color) => (
    <div className="flex items-center gap-2">
      <div 
        className="h-5 w-5 rounded border" 
        style={{ backgroundColor: color }}
      />
      <span>{color}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Basic metadata */}
      {renderMetadataSection("Basic Metadata", {
        title: metadata.title,
        description: metadata.description,
        logoUrl: metadata.logoUrl,
        themeColor: metadata.themeColor
      }, {}, <Info />)}

      {/* Open Graph data */}
      {opengraph && opengraph.length > 0 && (
        renderListSection(
          "Open Graph / Social Media", 
          opengraph,
          (item) => item.url,
          (item) => (
            <div>
              <div className="font-medium">{item.platform || item.title || "Unknown"}</div>
              {item.url && (
                <div className="mt-1 truncate text-xs text-muted-foreground">
                  URL: {item.url}
                </div>
              )}
              {item.description && (
                <div className="mt-1 line-clamp-2 text-xs">
                  {item.description}
                </div>
              )}
            </div>
          ),
          <Send />
        )
      )}

      {/* Color information */}
      {(colors.primaryColor || (colorSchemes && colorSchemes.length > 0)) && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <h3 className="text-sm font-medium">Brand Colors</h3>
          </div>
          <div className="p-4">
            {colors.primaryColor && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Primary Color</h4>
                {renderColorBox(colors.primaryColor)}
              </div>
            )}
            
            {colors.secondaryColors && colors.secondaryColors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Secondary Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  {colors.secondaryColors.map((color, i) => (
                    <div key={i}>{renderColorBox(color)}</div>
                  ))}
                </div>
              </div>
            )}

            {colorSchemes && colorSchemes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Color Schemes</h4>
                <div className="space-y-3">
                  {colorSchemes.map((scheme, i) => (
                    <div key={i} className="rounded-md bg-muted p-2">
                      <div className="font-medium text-sm">{scheme.name}</div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {scheme.primaryColor && (
                          <div className="flex flex-col items-center">
                            <div 
                              className="h-8 w-8 rounded border" 
                              style={{ backgroundColor: scheme.primaryColor }}
                            />
                            <span className="mt-1 text-xs text-muted-foreground">Primary</span>
                          </div>
                        )}
                        {scheme.secondaryColor && (
                          <div className="flex flex-col items-center">
                            <div 
                              className="h-8 w-8 rounded border" 
                              style={{ backgroundColor: scheme.secondaryColor }}
                            />
                            <span className="mt-1 text-xs text-muted-foreground">Secondary</span>
                          </div>
                        )}
                        {scheme.accentColor && (
                          <div className="flex flex-col items-center">
                            <div 
                              className="h-8 w-8 rounded border" 
                              style={{ backgroundColor: scheme.accentColor }}
                            />
                            <span className="mt-1 text-xs text-muted-foreground">Accent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Brand Analysis */}
      {brandAnalysis && Object.keys(brandAnalysis).length > 0 && 
        renderMetadataSection(
          "Brand Analysis", 
          brandAnalysis,
          {
            industryCategory: "Industry Category",
            businessType: "Business Type",
            targetAudience: "Target Audience",
            brandVoice: "Brand Voice",
            brandValues: "Brand Values",
            marketPosition: "Market Position",
            competitiveAdvantage: "Competitive Advantage",
            keyDifferentiators: "Key Differentiators"
          },
          <Globe />
        )
      }

      {/* Content Categories */}
      {contentCategories && contentCategories.length > 0 && (
        renderListSection(
          "Content Categories", 
          contentCategories,
          (item) => item.name,
          (item) => (
            <div>
              <div className="font-medium">{item.name}</div>
              {item.description && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          ),
          <BookOpen />
        )
      )}
    </div>
  );
} 