import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Grid
} from '@mui/material';
import {
  Home as HomeIcon,
  Refresh as RefreshIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { domainApi } from '../services/api';

// Import all the tab components
import GeneralTab from '../components/domain/GeneralTab';
import MetadataTab from '../components/domain/MetadataTab';
import SiteStructureTab from '../components/domain/SiteStructureTab';
import PagesTab from '../components/domain/PagesTab';
import BlogTab from '../components/domain/BlogTab';
import PlaceholderTab from '../components/domain/PlaceholderTab';
import AIAnalysisTab from '../components/domain/AIAnalysisTab';
import ExternalLinksTab from '../components/domain/ExternalLinksTab';
import BooksTab from '../components/domain/BooksTab';

// Map URL paths to tab indexes
const tabPathMap = {
  '': 0,
  'metadata': 1,
  'structure': 2,
  'pages': 3,
  'blog': 4,
  'media': 5,
  'feeds': 6,
  'social': 7,
  'links-and-partners': 8,
  'external-links': 9,
  'apps': 10,
  'events': 11,
  'podcasts': 12,
  'jobs': 13,
  'isbn': 14,
  'opengraph': 15,
  'youtube': 16,
  'schema': 17,
  'brand': 18,
  'colors': 19,
  'ai-analysis': 20,
  'crawl-status': 21,
  'debug': 22
};

// Map tab indexes to URL paths (reverse of above)
const tabIndexToPath = Object.entries(tabPathMap).reduce((acc, [path, index]) => {
  acc[index] = path;
  return acc;
}, {});

const DomainDetails = () => {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [domainData, setDomainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the current tab from the URL path
  const path = location.pathname.split(`/domains/${domainId}/`)[1] || '';
  const currentTabIndex = tabPathMap[path] || 0;
  
  const fetchDomainData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await domainApi.getDomainById(domainId);
      // Normalize data if needed to ensure consistent property access
      if (data && !data.domainName && data.domain_name) {
        data.domainName = data.domain_name;
      }
      if (data && !data.lastScraped && data.last_scraped_at) {
        data.lastScraped = data.last_scraped_at;
      }
      setDomainData(data);
    } catch (err) {
      setError('Failed to fetch domain data. Please try again later.');
      console.error('Error fetching domain data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDomainData();
  }, [domainId]);
  
  const handleTabChange = (event, newValue) => {
    const newPath = tabIndexToPath[newValue];
    navigate(`/domains/${domainId}${newPath ? `/${newPath}` : ''}`);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusChip = (status) => {
    const statusMap = {
      'complete': { color: 'success', label: 'Complete' },
      'processing': { color: 'warning', label: 'Processing' },
      'pending': { color: 'info', label: 'Pending' },
      'failed': { color: 'error', label: 'Failed' }
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || { color: 'default', label: status || 'Unknown' };
    
    return (
      <Chip 
        label={statusInfo.label} 
        color={statusInfo.color}
      />
    );
  };
  
  return (
    <Box>
      {/* Breadcrumb navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
          onClick={() => navigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary">Domain Details</Typography>
        {domainData && (
          <Typography color="text.primary">{domainData.domainName || domainData.domain_name}</Typography>
        )}
      </Breadcrumbs>
      
      {/* Domain header with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
          >
            Back to List
          </Button>
          <Typography variant="h4" component="h1">
            {loading ? 'Loading...' : (domainData?.domainName || domainData?.domain_name || 'Domain Details')}
          </Typography>
          {domainData && (
            <Box sx={{ ml: 2 }}>
              {getStatusChip(domainData.status)}
            </Box>
          )}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDomainData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}
      
      {!loading && !error && domainData && (
        <>
          {/* Domain overview card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Domain</Typography>
                <Typography variant="body1">{domainData.domainName || domainData.domain_name}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Last Crawled</Typography>
                <Typography variant="body1">{formatDate(domainData.lastScraped || domainData.last_scraped_at)}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Box>{getStatusChip(domainData.status)}</Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs navigation */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={currentTabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="General" />
              <Tab label="Metadata" />
              <Tab label="Site Structure" />
              <Tab label="Pages" />
              <Tab label="Blog" />
              <Tab label="Media" />
              <Tab label="Feeds" />
              <Tab label="Social" />
              <Tab label="Links & Partners" />
              <Tab label="External Links" />
              <Tab label="Apps" />
              <Tab label="Events" />
              <Tab label="Podcasts" />
              <Tab label="Jobs" />
              <Tab label="ISBN" />
              <Tab label="OpenGraph" />
              <Tab label="YouTube" />
              <Tab label="Schema" />
              <Tab label="Brand" />
              <Tab label="Colors" />
              <Tab label="AI Analysis" />
              <Tab label="Crawl Status" />
              <Tab label="Debug" />
            </Tabs>
          </Paper>

          {/* Tab content via routes */}
          <Routes>
            <Route path="/" element={<GeneralTab domainData={domainData} />} />
            <Route path="/metadata" element={<MetadataTab domainData={domainData} />} />
            <Route path="/structure" element={<SiteStructureTab domainData={domainData} />} />
            <Route path="/pages" element={<PagesTab domainData={domainData} />} />
            <Route path="/blog" element={<BlogTab domainData={domainData} />} />
            <Route path="/media" element={<PlaceholderTab tabName="Media" domainData={domainData} dataField="media" />} />
            <Route path="/feeds" element={<PlaceholderTab tabName="Feeds" domainData={domainData} dataField="feeds" />} />
            <Route path="/social" element={<PlaceholderTab tabName="Social" domainData={domainData} dataField="social" />} />
            <Route path="/links-and-partners" element={<ExternalLinksTab domainData={domainData} />} />
            <Route path="/external-links" element={<PlaceholderTab tabName="External Links" domainData={domainData} dataField="externalLinks" />} />
            <Route path="/apps" element={<PlaceholderTab tabName="Apps" domainData={domainData} dataField="apps" />} />
            <Route path="/events" element={<PlaceholderTab tabName="Events" domainData={domainData} dataField="events" />} />
            <Route path="/podcasts" element={<PlaceholderTab tabName="Podcasts" domainData={domainData} dataField="podcasts" />} />
            <Route path="/jobs" element={<PlaceholderTab tabName="Jobs" domainData={domainData} dataField="jobs" />} />
            <Route path="/isbn" element={<BooksTab domainData={domainData} />} />
            <Route path="/opengraph" element={<PlaceholderTab tabName="OpenGraph" domainData={domainData} dataField="opengraph" />} />
            <Route path="/youtube" element={<PlaceholderTab tabName="YouTube" domainData={domainData} dataField="youtube" />} />
            <Route path="/schema" element={<PlaceholderTab tabName="Schema" domainData={domainData} dataField="schema" />} />
            <Route path="/brand" element={<PlaceholderTab tabName="Brand" domainData={domainData} dataField="brand" />} />
            <Route path="/colors" element={<PlaceholderTab tabName="Colors" domainData={domainData} dataField="colors" />} />
            <Route path="/ai-analysis" element={<AIAnalysisTab domainData={domainData} />} />
            <Route path="/crawl-status" element={<PlaceholderTab tabName="Crawl Status" domainData={domainData} dataField="crawlStatus" />} />
            <Route path="/debug" element={<PlaceholderTab tabName="Debug" domainData={domainData} dataField="debug" />} />
          </Routes>
        </>
      )}
    </Box>
  );
};

export default DomainDetails; 