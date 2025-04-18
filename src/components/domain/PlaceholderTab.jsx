import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Construction } from 'lucide-react';
import { cn } from '../../lib/utils';

const PlaceholderTab = ({ tabName, domainData, dataField }) => {
  // Check if this data section exists in the domain data
  const hasData = dataField && domainData && domainData[dataField] && (
    Array.isArray(domainData[dataField]) 
      ? domainData[dataField].length > 0 
      : Object.keys(domainData[dataField]).length > 0
  );
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {tabName || 'Tab Content'}
      </h2>
      
      <Card className="bg-card">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Construction className="w-16 h-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            This tab is under construction
          </h3>
          <p className="mb-4 text-muted-foreground">
            The content for this section is being developed. Check back soon!
          </p>
        </CardContent>
      </Card>
      
      {dataField && (
        <>
          {hasData ? (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Raw Data Preview
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Here's a preview of the raw data available for this section:
                </p>
                
                <div className="h-px w-full bg-border mb-4" />
                
                {Array.isArray(domainData[dataField]) ? (
                  <div className="divide-y">
                    {domainData[dataField].slice(0, 5).map((item, index) => (
                      <div key={index} className="py-2">
                        <div className="font-medium">Item {index + 1}</div>
                        <ScrollArea className="h-24 mt-1 rounded border p-2">
                          <pre className="text-xs font-mono">
                            {JSON.stringify(item, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                    ))}
                    {domainData[dataField].length > 5 && (
                      <div className="py-2">
                        <div className="font-medium">+ {domainData[dataField].length - 5} more items</div>
                        <p className="text-sm text-muted-foreground">Full data will be available in the completed tab</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <ScrollArea className="h-72 rounded border p-2">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(domainData[dataField], null, 2)}
                    </pre>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">No Data Available</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    There is no data available for this section in the current domain.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaceholderTab; 