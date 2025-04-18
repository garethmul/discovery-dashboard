import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Globe, Server, Database, List, AlertCircle, Check } from "lucide-react";
import { isAuthenticated } from "../services/api";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Domain Crawler Dashboard - your centralized hub for viewing crawled domain data.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This dashboard displays comprehensive data about crawled domains, including metadata, podcasts, social media profiles, pages, images, and AI analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Globe className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>View Domains</CardTitle>
              <CardDescription>Browse crawled domains</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View all crawled domains, including metadata, site structure, and content analysis.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/domains" className="w-full">
              <Button variant="outline" className="w-full">Browse Domains</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Server className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Connection information</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isAuthenticated() ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm">
                  API Authentication: {isAuthenticated() ? "Connected" : "Not Connected"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isAuthenticated() 
                  ? "API connection is working. Click the wrench icon (🔧) in the bottom-right corner to change API key if needed."
                  : "API connection not established. Click the wrench icon (🔧) in the bottom-right corner to set your API key."}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Using API endpoint: {import.meta.env.VITE_API_URL || '/api'}
            </p>
          </CardFooter>
        </Card>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Getting Started</h2>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium">1. API Connection</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ensure the backend server is running. Click the wrench icon 🔧 in the bottom-right corner to set your API key.
            </p>
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium">2. Browse Domains</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Navigate to the Domains section to view all crawled domains.
            </p>
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <h3 className="text-sm font-medium">3. Troubleshooting</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If you encounter connection issues, refer to the HOW-TO-FIX-API-ISSUES.md file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 