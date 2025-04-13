import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Search, Menu, Home, Globe, Database, List } from 'lucide-react';

export function SidebarLayout() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const routes = [
    {
      title: "Home",
      icon: Home,
      href: "/",
      variant: "default",
    },
    {
      title: "Domains",
      icon: Globe,
      href: "/domains",
      variant: "ghost",
    },
    {
      title: "Crawl Data",
      icon: Database,
      href: "/crawl-data",
      variant: "ghost",
    },
    {
      title: "API Docs",
      icon: List,
      href: "/api-docs",
      variant: "ghost",
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold"
            >
              <Globe className="h-6 w-6" />
              <span>Domain Crawler</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              {routes.map((route, index) => (
                <Link
                  key={index}
                  to={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive(route.href) && "bg-muted text-primary"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link
                  to="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Globe className="h-6 w-6" />
                  <span>Domain Crawler</span>
                </Link>
              </div>
              <nav className="grid gap-2 px-2 py-4 text-lg font-medium">
                {routes.map((route, index) => (
                  <Link
                    key={index}
                    to={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive(route.href) && "bg-muted text-primary"
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form onSubmit={e => {
              e.preventDefault();
              if (search) {
                window.location.href = `/domains?search=${encodeURIComponent(search)}`;
              }
            }}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search domains..."
                  className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 