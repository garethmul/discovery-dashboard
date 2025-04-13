import React from "react";
import { Copy, CheckCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useState } from "react";

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const copyToClipboard = (text, endpoint) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      id: "get-domains",
      method: "GET",
      path: "/api/domains",
      description: "Get a list of all domains",
      parameters: [
        {
          name: "search",
          type: "query",
          description: "Filter domains by name",
          required: false,
        },
        {
          name: "limit",
          type: "query",
          description: "Limit the number of results",
          required: false,
        },
        {
          name: "offset",
          type: "query",
          description: "Pagination offset",
          required: false,
        },
      ],
      response: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: "string",
            domain: "string",
            status: "string",
            page_count: "number",
            last_crawled: "string (ISO date)",
            created_at: "string (ISO date)",
          },
        },
      },
    },
    {
      id: "get-domain",
      method: "GET",
      path: "/api/domains/:id",
      description: "Get detailed information about a domain",
      parameters: [
        {
          name: "id",
          type: "path",
          description: "Domain ID",
          required: true,
        },
      ],
      response: {
        type: "object",
        properties: {
          id: "string",
          domain: "string",
          status: "string",
          page_count: "number",
          last_crawled: "string (ISO date)",
          created_at: "string (ISO date)",
          metadata: "object",
          site_structure: "object",
          blog_content: "array",
          ai_analysis: "object",
        },
      },
    },
    {
      id: "create-domain",
      method: "POST",
      path: "/api/domains",
      description: "Create a new domain to crawl",
      parameters: [
        {
          name: "domain",
          type: "body",
          description: "Domain URL",
          required: true,
        },
        {
          name: "crawl_depth",
          type: "body",
          description: "Maximum crawl depth",
          required: false,
        },
      ],
      response: {
        type: "object",
        properties: {
          id: "string",
          domain: "string",
          status: "string (pending)",
          created_at: "string (ISO date)",
        },
      },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive documentation for the Domain Crawler API endpoints
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Authentication</h2>
        <div className="mt-2 rounded-lg border p-4">
          <p className="mb-2">All API requests require an API key to be included in the header:</p>
          <div className="overflow-auto rounded bg-muted p-2">
            <pre className="text-sm">{`X-API-Key: your_api_key_here`}</pre>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Contact the administrator to obtain your API key.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Base URL</h2>
        <div className="mt-2 rounded-lg border p-4">
          <p className="mb-2">All API endpoints are relative to:</p>
          <div className="flex items-center overflow-auto rounded bg-muted p-2">
            <pre className="flex-1 text-sm">{`https://api.domaincrawler.example.com`}</pre>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("https://api.domaincrawler.example.com", "base-url")}
            >
              {copiedEndpoint === "base-url" ? (
                <CheckCheck className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Endpoints</h2>
        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="rounded-lg border">
              <div className="flex items-center justify-between border-b bg-muted/40 p-4">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-semibold">{endpoint.path}</code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(endpoint.path, endpoint.id)}
                >
                  {copiedEndpoint === endpoint.id ? (
                    <CheckCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="p-4">
                <p className="mb-4">{endpoint.description}</p>
                <Tabs defaultValue="parameters">
                  <TabsList>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                  </TabsList>
                  <TabsContent value="parameters" className="mt-4">
                    {endpoint.parameters.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No parameters required</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="pb-2 pl-0 pr-4 text-left font-medium">Name</th>
                              <th className="pb-2 px-4 text-left font-medium">Type</th>
                              <th className="pb-2 px-4 text-left font-medium">Required</th>
                              <th className="pb-2 px-4 text-left font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpoint.parameters.map((param, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="py-2 pl-0 pr-4 align-top font-mono">{param.name}</td>
                                <td className="py-2 px-4 align-top">{param.type}</td>
                                <td className="py-2 px-4 align-top">
                                  {param.required ? "Yes" : "No"}
                                </td>
                                <td className="py-2 px-4 align-top">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="response" className="mt-4">
                    <div className="rounded bg-muted p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 