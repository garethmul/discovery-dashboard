import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { ExternalLink } from "lucide-react";

const schemaDefinitions = {
  NGO: {
    description: "Non-governmental organization - A non-profit organization whose members are countries or other NGOs.",
    url: "https://schema.org/NGO"
  },
  Organization: {
    description: "An organization such as a school, NGO, corporation, club, etc.",
    url: "https://schema.org/Organization"
  },
  BreadcrumbList: {
    description: "A BreadcrumbList is an ItemList consisting of a chain of linked Web pages.",
    url: "https://schema.org/BreadcrumbList"
  },
  WebPage: {
    description: "A web page. Every web page is implicitly assumed to be declared to be of type WebPage.",
    url: "https://schema.org/WebPage"
  },
  Article: {
    description: "An article, such as a news article or piece of investigative report.",
    url: "https://schema.org/Article"
  },
  BlogPosting: {
    description: "A blog post.",
    url: "https://schema.org/BlogPosting"
  },
  Person: {
    description: "A person (alive, dead, undead, or fictional).",
    url: "https://schema.org/Person"
  },
  Product: {
    description: "Any offered product or service.",
    url: "https://schema.org/Product"
  },
  Event: {
    description: "An event happening at a certain time and location.",
    url: "https://schema.org/Event"
  },
  LocalBusiness: {
    description: "A particular physical business or branch of an organization.",
    url: "https://schema.org/LocalBusiness"
  },
  ImageObject: {
    description: "An image file.",
    url: "https://schema.org/ImageObject"
  },
  VideoObject: {
    description: "A video file.",
    url: "https://schema.org/VideoObject"
  },
  FAQPage: {
    description: "A page containing FAQs (Frequently Asked Questions) and their answers.",
    url: "https://schema.org/FAQPage"
  },
  ContactPage: {
    description: "Web page type: Contact page.",
    url: "https://schema.org/ContactPage"
  },
  SearchAction: {
    description: "The act of searching for an object.",
    url: "https://schema.org/SearchAction"
  },
  WebSite: {
    description: "A WebSite is a set of related web pages and other items typically served from a single web domain.",
    url: "https://schema.org/WebSite"
  },
  ItemList: {
    description: "A list of items of any sort.",
    url: "https://schema.org/ItemList"
  },
  ListItem: {
    description: "An list item, e.g. a step in a checklist or how-to.",
    url: "https://schema.org/ListItem"
  }
};

// Helper function to format JSON objects for display
const formatObject = (obj, level = 0) => {
  if (!obj || typeof obj !== 'object') return null;
  
  return Object.keys(obj).map(key => {
    const value = obj[key];
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={key} className="ml-4">
          <span className="font-semibold">{key}:</span>
          <div className="ml-2">{formatObject(value, level + 1)}</div>
        </div>
      );
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div key={key} className="ml-4">
          <span className="font-semibold">{key}:</span>
          <div className="ml-2">
            {value.map((item, i) => (
              <div key={i} className="ml-2 mt-1">
                {typeof item === 'object' 
                  ? formatObject(item, level + 1) 
                  : <span>{String(item)}</span>}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Handle simple values
    return (
      <div key={key} className="ml-4">
        <span className="font-semibold">{key}:</span> <span>{String(value)}</span>
      </div>
    );
  });
};

export default function DomainSchema({ schemaMarkup }) {
  // Group schema items by type
  const schemaByType = React.useMemo(() => {
    const grouped = {};
    
    if (schemaMarkup && schemaMarkup.length > 0) {
      schemaMarkup.forEach(item => {
        const type = item.schemaType;
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(item);
      });
    }
    
    return grouped;
  }, [schemaMarkup]);
  
  const schemaTypes = Object.keys(schemaByType);
  
  if (!schemaMarkup || schemaMarkup.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schema.org Markup</CardTitle>
          <CardDescription>
            No schema.org markup was found on this domain.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema.org Markup</CardTitle>
        <CardDescription>
          Found {schemaMarkup.length} schema.org markup items across {schemaTypes.length} schema types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={schemaTypes[0]} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            {schemaTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="mb-1">
                {type} <Badge className="ml-2">{schemaByType[type].length}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {schemaTypes.map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  {type}
                  {schemaDefinitions[type] ? (
                    <a 
                      href={schemaDefinitions[type].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 hover:text-blue-700 inline-flex items-center"
                    >
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <a 
                      href={`https://schema.org/${type}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 hover:text-blue-700 inline-flex items-center"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </h3>
                {schemaDefinitions[type] ? (
                  <p className="text-sm text-muted-foreground mb-2">
                    {schemaDefinitions[type].description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-2">
                    Schema.org type - visit schema.org for more information about this type.
                  </p>
                )}
                
                <Accordion type="multiple" className="w-full">
                  {schemaByType[type].map((item, idx) => (
                    <AccordionItem key={item.id || idx} value={`${type}-${item.id || idx}`}>
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <span>Instance {idx + 1}</span>
                          <Badge variant="outline" className="ml-2">{item.markupFormat}</Badge>
                          {item.pageUrl && (
                            <span className="ml-2 text-xs text-muted-foreground truncate max-w-40">
                              {item.pageUrl}
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                          {formatObject(item.markupData)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 