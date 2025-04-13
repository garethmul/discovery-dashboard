import React, { useState, useEffect } from "react";
import { AlertTriangle, Image, Filter, ExternalLink, Download, X } from "lucide-react";

export default function DomainImages({ domain }) {
  const [filter, setFilter] = useState("all");
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Extract and normalize images from domain data
  useEffect(() => {
    if (!domain) return;

    // Gather images from different possible locations
    const allImages = [];
    
    // Check if we have media.images structure
    if (domain.media?.images) {
      // Option 1: images are in an 'all' array
      if (domain.media.images.all && Array.isArray(domain.media.images.all)) {
        allImages.push(...domain.media.images.all.map(img => ({
          ...img,
          category: img.category || img.type || "other"
        })));
      }
      
      // Option 2: images are categorized in specific arrays
      const categoryArrays = [
        { key: 'hero', name: 'Hero' },
        { key: 'logo', name: 'Logo' },
        { key: 'logoHighConfidence', name: 'Logo (High Confidence)' },
        { key: 'brand', name: 'Brand' },
        { key: 'team', name: 'Team' },
        { key: 'banner', name: 'Banner' },
        { key: 'product', name: 'Product' },
        { key: 'gallery', name: 'Gallery' },
        { key: 'background', name: 'Background' },
        { key: 'other', name: 'Other' }
      ];
      
      categoryArrays.forEach(({ key, name }) => {
        // Check both patterns: images.hero and images.heroImages
        const sourceArray = domain.media.images[key] || domain.media.images[`${key}Images`];
        if (sourceArray && Array.isArray(sourceArray)) {
          allImages.push(...sourceArray.map(img => ({
            ...img,
            category: name
          })));
        }
      });
      
      // Option 3: images are in byCategory object
      if (domain.media.images.byCategory) {
        Object.entries(domain.media.images.byCategory).forEach(([category, categoryImages]) => {
          if (Array.isArray(categoryImages)) {
            allImages.push(...categoryImages.map(img => ({
              ...img,
              category: category.charAt(0).toUpperCase() + category.slice(1)
            })));
          }
        });
      }
    }
    
    // Normalize image objects
    const normalizedImages = allImages.map(img => ({
      url: img.url || img.src || img.imageUrl,
      alt: img.alt || img.altText || img.description || 'Image',
      width: img.width || null,
      height: img.height || null,
      category: img.category || 'Other',
      confidence: img.confidence || null
    })).filter(img => img.url); // Filter out images without URL
    
    setImages(normalizedImages);
    setFilteredImages(normalizedImages);
  }, [domain]);

  // Handle filter change
  useEffect(() => {
    if (filter === "all") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category.toLowerCase() === filter.toLowerCase()));
    }
  }, [filter, images]);

  // Get unique categories for filter options
  const categories = ["all", ...new Set(images.map(img => img.category.toLowerCase()))];

  // Handle image click for preview
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close image preview
  const handleClosePreview = () => {
    setSelectedImage(null);
  };

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

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Image className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Images Found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No images were detected for this domain.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              filter === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {category === "all" ? "All Images" : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Image count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredImages.length} of {images.length} images
      </div>

      {/* Image gallery */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredImages.map((image, index) => (
          <div
            key={index}
            className="group cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md"
            onClick={() => handleImageClick(image)}
          >
            <div className="relative aspect-square bg-muted">
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400/png?text=Image+Error";
                }}
              />
              <div className="absolute inset-0 flex items-end justify-start p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded bg-black/70 px-2 py-1 text-xs text-white">
                  {image.category}
                  {image.confidence ? ` (${Math.round(image.confidence * 100)}%)` : ""}
                </span>
              </div>
            </div>
            <div className="p-2">
              <p className="truncate text-xs text-muted-foreground">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image preview modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-card p-1">
            <div className="sticky top-0 flex justify-end">
              <button
                onClick={handleClosePreview}
                className="rounded-full bg-destructive p-1 text-destructive-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-h-[70vh] max-w-full"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t p-4">
              <div>
                <p className="text-sm font-medium">Category: {selectedImage.category}</p>
                <p className="text-sm text-muted-foreground">{selectedImage.alt}</p>
                {selectedImage.width && selectedImage.height && (
                  <p className="text-xs text-muted-foreground">
                    {selectedImage.width} × {selectedImage.height}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Original
                </a>
                <a
                  href={selectedImage.url}
                  download
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 