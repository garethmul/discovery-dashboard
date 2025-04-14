import React from "react";
import { AlertTriangle, Book, ExternalLink } from "lucide-react";

export default function DomainBooks({ domain }) {
  console.log('DomainBooks - Received domain:', domain);
  console.log('DomainBooks - Books data:', domain?.data?.books);
  console.log('DomainBooks - ISBNs:', domain?.data?.books?.isbns);
  console.log('DomainBooks - ISBN Images:', domain?.data?.books?.isbnImages);

  if (!domain?.data?.books?.isbns && !domain?.data?.books?.isbnImages) {
    console.log('DomainBooks - No book data found, showing empty state');
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Book Data Available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No book or ISBN information has been found for this domain.
        </p>
      </div>
    );
  }

  const { isbns = [], isbnImages = [] } = domain.data.books;
  console.log('DomainBooks - Extracted ISBNs:', isbns.length, 'ISBN entries');
  console.log('DomainBooks - Extracted ISBN Images:', isbnImages.length, 'image entries');

  // Create a map of ISBNs to their details
  const isbnMap = new Map();
  
  // Add text-based ISBNs
  isbns.forEach(isbn => {
    isbnMap.set(isbn.isbn, {
      isbn: isbn.isbn,
      type: isbn.isbn_type,
      page: isbn.page_url,
      context: isbn.context,
      images: []
    });
  });
  console.log('DomainBooks - After processing ISBNs, map size:', isbnMap.size);

  // Add image-based ISBNs and merge with existing entries
  isbnImages.forEach(img => {
    if (isbnMap.has(img.isbn)) {
      const existing = isbnMap.get(img.isbn);
      existing.images.push({
        url: img.image_url,
        page: img.page_url,
        alt: img.alt_text
      });
    } else {
      isbnMap.set(img.isbn, {
        isbn: img.isbn,
        images: [{
          url: img.image_url,
          page: img.page_url,
          alt: img.alt_text
        }]
      });
    }
  });
  console.log('DomainBooks - After processing images, final map size:', isbnMap.size);
  console.log('DomainBooks - Final ISBN data:', Array.from(isbnMap.entries()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Books and ISBNs</h2>
        <div className="text-sm text-muted-foreground">
          {isbnMap.size} unique ISBNs found
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from(isbnMap.entries()).map(([isbn, details]) => (
            <div key={isbn} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start gap-4">
                {details.images.length > 0 ? (
                  <img
                    src={details.images[0].url}
                    alt={details.images[0].alt || `Book cover for ISBN ${isbn}`}
                    className="h-32 w-24 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-32 w-24 bg-muted flex items-center justify-center rounded-md">
                    <Book className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-grow">
                  <h3 className="font-medium">ISBN: {isbn}</h3>
                  {details.type && (
                    <p className="text-sm text-muted-foreground">
                      Type: {details.type}
                    </p>
                  )}
                  {details.context && (
                    <p className="mt-1 text-sm line-clamp-2">
                      {details.context}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {details.page && (
                  <a
                    href={details.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs hover:bg-muted/80"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View Page
                  </a>
                )}
                <a
                  href={`https://www.worldcat.org/isbn/${isbn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs hover:bg-muted/80"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  WorldCat
                </a>
                <a
                  href={`https://www.goodreads.com/search?q=${isbn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs hover:bg-muted/80"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Goodreads
                </a>
              </div>

              {details.images.length > 1 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Additional Images:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {details.images.slice(1).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={img.alt || `Additional book cover for ISBN ${isbn}`}
                        className="h-16 w-12 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 