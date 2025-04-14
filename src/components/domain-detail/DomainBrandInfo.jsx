import React from "react";
import { AlertTriangle, Building2, Globe2, Users, MessageSquare, Briefcase, PaintBucket, Type, Image, MapPin, Calendar, Star } from "lucide-react";

const DomainBrandInfo = ({ domain }) => {
  console.log('Domain data in BrandInfo:', domain);
  const brandData = domain?.brandfetch;
  console.log('Brand data:', brandData);

  if (!brandData?.data) {
    return (
      <div className="p-4 text-center text-gray-500">
        No brand data available for this domain.
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
              {brandData.data.longDescription && (
                <div>
                  <h4 className="text-sm font-medium">Long Description</h4>
                  <p className="text-sm text-muted-foreground">{brandData.data.longDescription}</p>
                </div>
              )}
              {brandData.data.company && (
                <>
                  {brandData.data.company.location && (
                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {[
                          brandData.data.company.location.city,
                          brandData.data.company.location.state,
                          brandData.data.company.location.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}
                  {brandData.data.company.foundedYear && (
                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Founded
                      </h4>
                      <p className="text-sm text-muted-foreground">{brandData.data.company.foundedYear}</p>
                    </div>
                  )}
                  {brandData.data.company.employees && (
                    <div>
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Employees
                      </h4>
                      <p className="text-sm text-muted-foreground">{brandData.data.company.employees}</p>
                    </div>
                  )}
                  {brandData.data.company.industries && brandData.data.company.industries.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium">Industries</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {brandData.data.company.industries.map((industry, index) => (
                          <div key={index} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                            {industry.emoji} {industry.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              {brandData.data.qualityScore && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Quality Score
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(brandData.data.qualityScore * 100)}%
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Banner Images */}
      {brandData.data?.images && brandData.data.images.length > 0 && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <h3 className="text-sm font-medium">Banner Images</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-4">
              {brandData.data.images.map((image, index) => (
                <div key={index} className="space-y-2">
                  {image.formats && image.formats.length > 0 && (
                    <div className="overflow-hidden rounded-lg border bg-white">
                      <img
                        src={image.formats[0].src}
                        alt={`${image.type} image`}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium capitalize">{image.type}</p>
                    {image.formats && image.formats.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {image.formats[0].width}x{image.formats[0].height}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Brand Logos */}
      {brandData.data?.logos && brandData.data.logos.length > 0 && (
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <h3 className="text-sm font-medium">Brand Logos</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brandData.data.logos.map((logo, index) => (
                <div key={index} className="space-y-2">
                  {logo.formats && logo.formats.length > 0 && (
                    <div className="aspect-square overflow-hidden rounded-lg border bg-white p-2">
                      <img
                        src={logo.formats[0].src}
                        alt={`${logo.type} logo - ${logo.theme} theme`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium capitalize">{logo.type}</p>
                    <p className="text-sm text-muted-foreground capitalize">{logo.theme} theme</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
};

export default DomainBrandInfo; 