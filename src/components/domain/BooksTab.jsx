import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Search, RefreshCw, BookOpen, ExternalLink } from "lucide-react";
import axios from 'axios';

const BooksTab = ({ domainData }) => {
  const [booksData, setBooksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const fetchBooksData = async () => {
    if (!domainData || !domainData.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching books for domain ID: ${domainData.id}`);
      const response = await axios.get(`/api/books/${domainData.id}`);
      console.log('Books data response:', response.data);
      setBooksData(response.data);
      setSearchResults(null);
      setSelectedBook(null);
      setDebugInfo({
        endpoint: `/api/books/${domainData.id}`,
        dataReceived: !!response.data,
        hasBooks: response.data?.books?.length > 0,
        dataKeys: Object.keys(response.data || {})
      });
    } catch (err) {
      console.error('Error fetching books data:', err);
      setError('Failed to load books data. Please try again later.');
      setDebugInfo({
        endpoint: `/api/books/${domainData.id}`,
        error: err.message,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !domainData || !domainData.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/books/${domainData.id}/search?query=${encodeURIComponent(searchQuery)}`);
      console.log('Search results:', response.data);
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error searching books:', err);
      setError('Failed to search books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookDetails = async (isbn) => {
    if (!isbn || !domainData || !domainData.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching book details for ISBN: ${isbn}`);
      const response = await axios.get(`/api/books/${domainData.id}/isbn/${isbn}`);
      console.log('Book details response:', response.data);
      setSelectedBook(response.data);
      setDebugInfo({
        endpoint: `/api/books/${domainData.id}/isbn/${isbn}`,
        dataReceived: !!response.data,
        dataKeys: Object.keys(response.data || {})
      });
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load book details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksData();
  }, [domainData?.id]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    // Reset search and selected book when changing tabs
    if (value === "books") {
      setSearchResults(null);
      setSelectedBook(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const renderBooksList = () => {
    const books = searchResults?.results || booksData?.books || [];
    
    if (!books.length) {
      return (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No books found for this domain.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card 
            key={book.isbn}
            className="overflow-hidden h-full transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer"
            onClick={() => fetchBookDetails(book.isbn)}
          >
            <div className="h-[200px] bg-muted flex items-center justify-center">
              <img 
                src={book.image || 'https://via.placeholder.com/200x300?text=No+Image'}
                alt={book.title || 'Book cover'}
                className="h-full object-contain"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">
                {book.title || 'Unknown Title'}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                By {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ISBN: {book.isbn}
              </p>
              <p className="text-sm text-muted-foreground">
                Publisher: {book.publisher || 'N/A'}
              </p>
              {book.available === false && (
                <Badge variant="warning" className="mt-2">
                  Referenced Only
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderBookDetails = () => {
    if (!selectedBook) {
      return (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Select a book from the list to view details.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setSelectedBook(null)}
        >
          <BookOpen className="h-4 w-4" />
          <span>Back to Books List</span>
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 flex justify-center">
            <img
              src={selectedBook.image || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={selectedBook.title || 'Book cover'}
              className="max-w-[300px] w-full h-auto object-contain"
            />
          </div>
          
          <div className="md:col-span-8">
            <h2 className="text-2xl font-bold">
              {selectedBook.title || 'Unknown Title'}
            </h2>
            
            <h3 className="text-xl text-muted-foreground mb-4">
              By {selectedBook.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
            </h3>
            
            <div className="flex flex-wrap gap-2 my-4">
              <Badge>
                {selectedBook.binding || 'Unknown Format'}
              </Badge>
              {selectedBook.subjects?.map((subject) => (
                <Badge key={subject.id} variant="outline">
                  {subject.name}
                </Badge>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  ISBN-10
                </p>
                <p className="mb-2">
                  {selectedBook.isbn || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  ISBN-13
                </p>
                <p className="mb-2">
                  {selectedBook.isbn13 || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  Publisher
                </p>
                <p className="mb-2">
                  {selectedBook.publisher || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  Publication Date
                </p>
                <p className="mb-2">
                  {selectedBook.date_published ? new Date(selectedBook.date_published).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  Pages
                </p>
                <p className="mb-2">
                  {selectedBook.pages || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">
                  Language
                </p>
                <p className="mb-2">
                  {selectedBook.language || 'N/A'}
                </p>
              </div>
              
              {selectedBook.msrp && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    MSRP
                  </p>
                  <p className="mb-2">
                    ${selectedBook.msrp.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            
            {selectedBook.dimensions && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Dimensions
                </p>
                <p className="mb-2">
                  {selectedBook.dimensions}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {selectedBook.overview && (
          <div>
            <h3 className="text-xl font-semibold">
              Overview
            </h3>
            <p className="mt-2">
              {selectedBook.overview}
            </p>
          </div>
        )}
        
        {selectedBook.synopsis && (
          <div>
            <h3 className="text-xl font-semibold">
              Synopsis
            </h3>
            <p className="mt-2">
              {selectedBook.synopsis}
            </p>
          </div>
        )}
        
        {selectedBook.external_links && selectedBook.external_links.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              External Links
            </h3>
            <div className="flex flex-col space-y-2">
              {selectedBook.external_links.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.title || link.url}
                </a>
              ))}
            </div>
          </div>
        )}
        
        {selectedBook.prices?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Available From
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Shipping</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBook.prices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{price.merchant}</TableCell>
                      <TableCell>{price.book_condition}</TableCell>
                      <TableCell>${parseFloat(price.price).toFixed(2)}</TableCell>
                      <TableCell>{price.shipping}</TableCell>
                      <TableCell>${parseFloat(price.total).toFixed(2)}</TableCell>
                      <TableCell>
                        {price.link && (
                          <a 
                            href={price.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Buy <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {selectedBook.other_isbns?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Other Editions
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedBook.other_isbns.map((isbn) => (
                <Badge 
                  key={isbn.isbn}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => fetchBookDetails(isbn.isbn)}
                >
                  {isbn.isbn} ({isbn.binding})
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {selectedBook.domain_references?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              References on {domainData.domainName || domainData.domain_name}
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page URL</TableHead>
                    <TableHead>Context</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Found At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBook.domain_references.map((ref) => (
                    <TableRow key={ref.id}>
                      <TableCell>
                        <a 
                          href={ref.page_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {ref.page_url} <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>{ref.context || 'N/A'}</TableCell>
                      <TableCell>{ref.isbn_type}</TableCell>
                      <TableCell>{formatDate(ref.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {selectedBook.domain_images?.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Book Images on {domainData.domainName || domainData.domain_name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedBook.domain_images.map((img) => (
                <Card key={img.id}>
                  <div className="h-[200px] bg-muted flex items-center justify-center">
                    <img 
                      src={img.image_url}
                      alt={img.alt_text || 'Book image'}
                      className="h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Found on: <a 
                        href={img.page_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                      >
                        {img.page_url} <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    {img.alt_text && (
                      <p className="text-sm mt-2">
                        Alt Text: {img.alt_text}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReferencesTable = () => {
    const references = booksData?.references || [];
    
    if (!references.length) {
      return (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No ISBN references found for this domain.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ISBN</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Page URL</TableHead>
              <TableHead>Context</TableHead>
              <TableHead>Found At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {references.map((ref) => (
              <TableRow key={ref.id}>
                <TableCell>
                  <button
                    onClick={() => fetchBookDetails(ref.isbn)}
                    className="text-blue-600 hover:underline"
                  >
                    {ref.isbn}
                  </button>
                </TableCell>
                <TableCell>{ref.isbn_type}</TableCell>
                <TableCell>
                  <a 
                    href={ref.page_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {ref.page_url} <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>{ref.context || 'N/A'}</TableCell>
                <TableCell>{formatDate(ref.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderImagesTable = () => {
    const images = booksData?.images || [];
    
    if (!images.length) {
      return (
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>No book images found for this domain.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <Card key={img.id}>
            <div className="h-[200px] bg-muted flex items-center justify-center">
              <img 
                src={img.image_url}
                alt={img.alt_text || 'Book image'}
                className="h-full object-contain"
              />
            </div>
            <CardContent className="p-4">
              <p className="text-sm mb-2">
                <button
                  onClick={() => fetchBookDetails(img.isbn)}
                  className="text-blue-600 hover:underline"
                >
                  ISBN: {img.isbn}
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                Found on: <a 
                  href={img.page_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                >
                  {img.page_url} <ExternalLink className="h-3 w-3" />
                </a>
              </p>
              {img.alt_text && (
                <p className="text-sm mt-2">
                  Alt Text: {img.alt_text}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderStatsSection = () => {
    const stats = booksData?.stats || {};
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Books</p>
            <p className="text-2xl font-bold">{stats.totalBooks || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Available Books</p>
            <p className="text-2xl font-bold">{stats.availableBooks || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total References</p>
            <p className="text-2xl font-bold">{stats.totalReferences || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Images</p>
            <p className="text-2xl font-bold">{stats.totalImages || 0}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLoadingIndicator = () => (
    <div className="py-8 space-y-4">
      <div className="flex justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <Progress value={60} className="w-full max-w-md mx-auto" />
      <p className="text-center text-muted-foreground text-sm">Loading book data...</p>
    </div>
  );

  const renderDebugInfo = () => {
    if (!debugInfo) return null;
    
    return (
      <div className="mt-6 p-4 border border-dashed border-yellow-500 rounded-lg bg-yellow-50 text-sm">
        <h4 className="font-semibold mb-2">Debug Information</h4>
        <pre className="overflow-auto text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
        {selectedBook && (
          <>
            <Separator className="my-2" />
            <h4 className="font-semibold mb-2">Selected Book Data Keys</h4>
            <ul className="list-disc pl-5">
              {Object.keys(selectedBook).map(key => (
                <li key={key}>{key}: {typeof selectedBook[key]}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Books
        </h2>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={fetchBooksData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
      
      {loading && !selectedBook && renderLoadingIndicator()}
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!loading && !error && booksData && !selectedBook && renderStatsSection()}
      
      {!loading && !error && (
        <>
          {!selectedBook && (
            <>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="books">Books</TabsTrigger>
                  <TabsTrigger value="references">ISBN References</TabsTrigger>
                  <TabsTrigger value="images">Book Images</TabsTrigger>
                </TabsList>
                
                {activeTab === "books" && (
                  <div className="flex mt-4 mb-6 gap-2">
                    <Input
                      placeholder="Search Books"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSearch}
                      disabled={loading || !searchQuery.trim()}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Tabs>
              
              {searchResults && (
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Search Results: {searchResults.total} books found for "{searchResults.query}"
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchResults(null);
                      setSearchQuery('');
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </>
          )}
          
          <TabsContent value="books" className={activeTab === "books" ? "" : "hidden"}>
            {selectedBook ? renderBookDetails() : renderBooksList()}
          </TabsContent>
          <TabsContent value="references" className={activeTab === "references" ? "" : "hidden"}>
            {renderReferencesTable()}
          </TabsContent>
          <TabsContent value="images" className={activeTab === "images" ? "" : "hidden"}>
            {renderImagesTable()}
          </TabsContent>
        </>
      )}
      
      {process.env.NODE_ENV !== 'production' && renderDebugInfo()}
    </div>
  );
};

export default BooksTab; 