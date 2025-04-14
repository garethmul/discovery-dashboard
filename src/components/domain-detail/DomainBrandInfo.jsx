import React from "react";
import { AlertTriangle, Building2, Globe2, Users, MessageSquare, Briefcase, PaintBucket, Type } from "lucide-react";

export default function DomainBrandInfo({ domain }) {
  // Extract brand data from the domain object
  console.log('Domain data in BrandInfo:', domain);
  const brandData = domain?.data?.brandfetch;
  console.log('Extracted brand data:', brandData);
  
  if (!brandData) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Brand Data Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No brand information has been fetched for this domain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg border">
        <div className="border-b bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <h3 className="text-sm font-medium">Company Information</h3>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium">Domain</h4>
            <p className="text-lg font-semibold">{brandData.domain}</p>
          </div>
          {brandData.data && (
            <>
              {brandData.data.name && (
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-lg font-semibold">{brandData.data.name}</p>
                </div>
              )}
              {brandData.data.description && (
                <div>
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{brandData.data.description}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Brand Colors */}
      {brandData.data?.colors && brandData.data.colors.length > 0 && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <PaintBucket className="h-4 w-4" />
              <h3 className="text-sm font-medium">Brand Colors</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brandData.data.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="font-medium capitalize">{color.type}</p>
                    <p className="text-sm text-muted-foreground">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fonts */}
      {brandData.data?.fonts && brandData.data.fonts.length > 0 && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <h3 className="text-sm font-medium">Brand Fonts</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {brandData.data.fonts.map((font, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium">{font.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {font.type} font • {font.origin}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Links */}
      {brandData.data?.links && brandData.data.links.length > 0 && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4" />
              <h3 className="text-sm font-medium">Brand Links</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-2">
              {brandData.data.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <span className="capitalize">{link.type}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="truncate">{link.url}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 