import React, { useState, useEffect } from "react";
import { getDomains } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { storeApiKey, isAuthenticated } from "../services/api";

export default function ApiDebug() {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiToken') || 'test-api-key-123');
  const [expanded, setExpanded] = useState(false);

  const fetchApiData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDomains();
      setApiResponse(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('API Debug Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchApiData();
    }
  }, [expanded]);

  const handleSaveApiKey = () => {
    storeApiKey(apiKey);
    fetchApiData();
  };

  if (!expanded) {
    return (
      <Button 
        className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full p-2 shadow-md"
        variant="outline"
        onClick={() => setExpanded(true)}
      >
        🔧
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[400px] shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>API Debug</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(false)}
          >
            ×
          </Button>
        </CardTitle>
        <CardDescription>
          API Authentication: {isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-3 flex flex-col gap-2">
          <label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
          <div className="flex gap-2">
            <Input 
              id="apiKey"
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
            />
            <Button onClick={handleSaveApiKey}>Save</Button>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">API Response</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchApiData} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
          
          {error ? (
            <div className="rounded border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <pre className="max-h-[200px] overflow-auto rounded border bg-muted p-2 text-xs">
              {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No data'}
            </pre>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => localStorage.removeItem('apiToken')}
        >
          Clear API Key
        </Button>
      </CardFooter>
    </Card>
  );
} 