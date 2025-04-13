import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { SidebarLayout } from "./components/layout/sidebar-layout";
import DomainListPage from "./components/domain-list/DomainListPage";
import DomainDetailPage from "./components/domain-detail/DomainDetailPage";
import HomePage from "./components/HomePage";
import ApiDocsPage from "./components/ApiDocsPage";
import ApiDebug from "./components/ApiDebug";

// NavigationLogger component to log route changes
const NavigationLogger = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location]);
  
  return null;
};

// Get the base URL from the environment or use a default
// Use empty string for local development to avoid basename routing issues
const isDevelopment = import.meta.env.DEV;
const BASE_URL = isDevelopment ? '' : '/dashboard';

function App() {
  return (
    <BrowserRouter basename={BASE_URL}>
      <NavigationLogger />
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<HomePage />} />
          <Route path="domains" element={<DomainListPage />} />
          <Route path="domains/:id" element={<DomainDetailPage />} />
          <Route path="crawl-data" element={<Navigate to="/domains" replace />} />
          <Route path="api-docs" element={<ApiDocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ApiDebug />
    </BrowserRouter>
  );
}

export default App; 