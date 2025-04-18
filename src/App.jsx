import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { SidebarLayout } from "./components/layout/sidebar-layout";
import DomainListPage from "./components/domain-list/DomainListPage";
import DomainDetailPage from "./components/domain-detail/DomainDetailPage";
import HomePage from "./components/HomePage";

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 