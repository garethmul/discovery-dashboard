import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Tooltip,
  Tabs,
  Tab,
  Link as MuiLink,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  Link as LinkIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Language as LanguageIcon,
  Handshake as HandshakeIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import axios from 'axios';

const ExternalLinksTab = ({ domainData }) => {
  const [externalLinksData, setExternalLinksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartners, setFilterPartners] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainDetails, setDomainDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchExternalLinksData = async () => {
      if (!domainData?.domainId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/external-links/${domainData.domainId}`);
        setExternalLinksData(response.data);
      } catch (err) {
        console.error('Error fetching external links data:', err);
        setError(err.response?.data?.error || 'Failed to load external links data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExternalLinksData();
  }, [domainData?.domainId]);

  // Fetch domain details when a domain is selected
  useEffect(() => {
    const fetchDomainDetails = async () => {
      if (!selectedDomain || !domainData?.domainId) return;
      
      setLoadingDetails(true);
      
      try {
        const response = await axios.get(`/api/external-links/${domainData.domainId}/domain/${selectedDomain}`);
        setDomainDetails(response.data);
      } catch (err) {
        console.error('Error fetching domain details:', err);
      } finally {
        setLoadingDetails(false);
      }
    };
    
    fetchDomainDetails();
  }, [selectedDomain, domainData?.domainId]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset domain selection when changing tabs
    setSelectedDomain(null);
    setDomainDetails(null);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle domain selection
  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setTabValue(2); // Switch to details tab
  };

  // Filter domains based on search and partner status
  const getFilteredDomains = () => {
    if (!externalLinksData?.summary) return [];
    
    return externalLinksData.summary.filter(domain => {
      const matchesSearch = searchTerm === '' || 
        domain.external_domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPartner = !filterPartners || domain.is_partner === 1;
      
      return matchesSearch && matchesPartner;
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  // Determine confidence display
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'primary';
    if (confidence >= 0.5) return 'warning';
    return 'error';
  };

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // Render if no data
  if (!externalLinksData || externalLinksData.summary.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No external links data available for this domain.
      </Alert>
    );
  }

  // Filtered domains for display
  const filteredDomains = getFilteredDomains();
  
  // Paginated domains
  const paginatedDomains = filteredDomains
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Stats from data
  const { 
    totalExternalDomains, 
    totalExternalLinks, 
    totalPartnerDomains, 
    totalPartnerLinks,
    partnerPercentage,
    confidenceDistribution 
  } = externalLinksData.stats;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        External Links & Partners
      </Typography>

      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              External Domains
            </Typography>
            <Typography variant="h4">
              {formatNumber(totalExternalDomains)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Links
            </Typography>
            <Typography variant="h4">
              {formatNumber(totalExternalLinks)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Partner Domains
            </Typography>
            <Typography variant="h4">
              {formatNumber(totalPartnerDomains)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Partner Links
            </Typography>
            <Typography variant="h4">
              {formatNumber(totalPartnerLinks)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Overview" icon={<LanguageIcon />} iconPosition="start" />
          <Tab label="All Domains" icon={<LinkIcon />} iconPosition="start" />
          {selectedDomain && <Tab label={`Domain: ${selectedDomain}`} icon={<HandshakeIcon />} iconPosition="start" />}
        </Tabs>
      </Paper>

      {/* Tab content */}
      <Box sx={{ mt: 3 }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <>
            {/* Quick stats */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Top External Domains
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Domain</TableCell>
                            <TableCell align="right">Links</TableCell>
                            <TableCell align="center">Partner</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {externalLinksData.topDomains.slice(0, 5).map((domain) => (
                            <TableRow key={domain.id} hover
                              onClick={() => handleDomainSelect(domain.external_domain)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LinkIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                  {domain.external_domain}
                                </Box>
                              </TableCell>
                              <TableCell align="right">{domain.link_count}</TableCell>
                              <TableCell align="center">
                                {domain.is_partner === 1 ? (
                                  <Chip 
                                    size="small"
                                    color={getConfidenceColor(domain.partner_confidence)}
                                    label={`${Math.round(domain.partner_confidence * 100)}%`}
                                  />
                                ) : (
                                  <Chip size="small" variant="outlined" label="No" />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        size="small" 
                        onClick={() => setTabValue(1)}
                        variant="outlined"
                      >
                        View All Domains
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Top Partner Domains
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Domain</TableCell>
                            <TableCell align="right">Links</TableCell>
                            <TableCell align="center">Confidence</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {externalLinksData.topPartnerDomains.slice(0, 5).map((domain) => (
                            <TableRow key={domain.id} hover
                              onClick={() => handleDomainSelect(domain.external_domain)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <HandshakeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                  {domain.external_domain}
                                </Box>
                              </TableCell>
                              <TableCell align="right">{domain.link_count}</TableCell>
                              <TableCell align="center">
                                <Chip 
                                  size="small"
                                  color={getConfidenceColor(domain.partner_confidence)}
                                  label={`${Math.round(domain.partner_confidence * 100)}%`}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        size="small" 
                        onClick={() => {
                          setFilterPartners(true);
                          setTabValue(1);
                        }}
                        variant="outlined"
                      >
                        View All Partners
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                      <PieChartIcon sx={{ mr: 1 }} />
                      Partner Distribution
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Partner vs Non-Partner Domains
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(partnerPercentage)}
                              sx={{ 
                                height: 20, 
                                borderRadius: 1,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: 'primary.main',
                                }
                              }}
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">
                              {`${partnerPercentage}%`}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Partners: {formatNumber(totalPartnerDomains)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Non-Partners: {formatNumber(totalExternalDomains - totalPartnerDomains)}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Partner Confidence Distribution
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Confidence Range</TableCell>
                                <TableCell align="right">Count</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(confidenceDistribution).map(([range, count]) => (
                                <TableRow key={range}>
                                  <TableCell>{range}</TableCell>
                                  <TableCell align="right">{count}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* All Domains Tab */}
        {tabValue === 1 && (
          <>
            {/* Search and filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search domains..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ flexGrow: 1, minWidth: '200px' }}
              />
              
              <Button
                variant={filterPartners ? "contained" : "outlined"}
                startIcon={<HandshakeIcon />}
                onClick={() => setFilterPartners(!filterPartners)}
                size="small"
              >
                {filterPartners ? "All Domains" : "Partners Only"}
              </Button>
            </Box>
            
            {/* Domains table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>External Domain</TableCell>
                    <TableCell align="center">Link Count</TableCell>
                    <TableCell align="center">Partner Status</TableCell>
                    <TableCell align="center">Confidence</TableCell>
                    <TableCell>Example URL</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedDomains.map((domain) => (
                    <TableRow key={domain.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {domain.is_partner === 1 ? 
                            <HandshakeIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} /> : 
                            <LinkIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          }
                          {domain.external_domain}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{domain.link_count}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={domain.is_partner === 1 ? "Partner" : "External"} 
                          color={domain.is_partner === 1 ? "primary" : "default"}
                          size="small"
                          variant={domain.is_partner === 1 ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {domain.is_partner === 1 ? (
                          <Tooltip title={domain.partner_context || 'No context available'}>
                            <Chip 
                              size="small"
                              color={getConfidenceColor(domain.partner_confidence)}
                              label={`${Math.round(domain.partner_confidence * 100)}%`}
                            />
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {domain.example_url ? (
                          <Tooltip title={domain.example_url}>
                            <MuiLink 
                              href={domain.example_url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                display: 'inline-block',
                                maxWidth: '200px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {domain.example_url}
                            </MuiLink>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          onClick={() => handleDomainSelect(domain.external_domain)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredDomains.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" sx={{ py: 2 }}>
                          No domains found matching the current filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={filteredDomains.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </>
        )}

        {/* Domain Details Tab */}
        {tabValue === 2 && selectedDomain && (
          <>
            {loadingDetails ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : !domainDetails ? (
              <Alert severity="error">Failed to load details for {selectedDomain}</Alert>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Paper sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          Domain Details: {domainDetails.summary.external_domain}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Link Count:</strong> {domainDetails.summary.link_count}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Partner Status:</strong> {' '}
                          <Chip 
                            label={domainDetails.summary.is_partner === 1 ? "Partner" : "External"} 
                            color={domainDetails.summary.is_partner === 1 ? "primary" : "default"}
                            size="small"
                            variant={domainDetails.summary.is_partner === 1 ? "filled" : "outlined"}
                          />
                        </Typography>
                        
                        {domainDetails.summary.is_partner === 1 && (
                          <>
                            <Typography variant="body2" gutterBottom>
                              <strong>Confidence:</strong> {' '}
                              <Chip 
                                size="small"
                                color={getConfidenceColor(domainDetails.summary.partner_confidence)}
                                label={`${Math.round(domainDetails.summary.partner_confidence * 100)}%`}
                              />
                            </Typography>
                            
                            <Typography variant="body2" gutterBottom>
                              <strong>Partner Context:</strong> {domainDetails.summary.partner_context || 'No context available'}
                            </Typography>
                          </>
                        )}
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>First Seen:</strong> {formatDate(domainDetails.summary.created_at)}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          <strong>Last Updated:</strong> {formatDate(domainDetails.summary.updated_at)}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        {domainDetails.summary.example_url && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Example URL:
                            </Typography>
                            <MuiLink 
                              href={domainDetails.summary.example_url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              display="block"
                              sx={{ wordBreak: 'break-all' }}
                            >
                              {domainDetails.summary.example_url}
                            </MuiLink>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
                
                {/* Individual links */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Individual Links ({domainDetails.details.length})
                </Typography>
                
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Source URL</TableCell>
                        <TableCell>Target URL</TableCell>
                        <TableCell>Link Text</TableCell>
                        <TableCell align="center">Partner</TableCell>
                        <TableCell align="center">Active</TableCell>
                        <TableCell align="right">Last Seen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {domainDetails.details.slice(0, 10).map((link) => (
                        <TableRow key={link.id} hover>
                          <TableCell>
                            <Tooltip title={link.source_url}>
                              <MuiLink 
                                href={link.source_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                  display: 'inline-block',
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {link.source_url}
                              </MuiLink>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={link.target_url}>
                              <MuiLink 
                                href={link.target_url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ 
                                  display: 'inline-block',
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {link.target_url}
                              </MuiLink>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={link.link_text || 'No text'}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  maxWidth: '150px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {link.link_text || (link.img_alt ? `[Image: ${link.img_alt}]` : '[No text]')}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={link.is_partner === 1 ? "Yes" : "No"} 
                              color={link.is_partner === 1 ? "primary" : "default"}
                              size="small"
                              variant={link.is_partner === 1 ? "filled" : "outlined"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={link.is_active === 1 ? "Active" : "Inactive"} 
                              color={link.is_active === 1 ? "success" : "error"}
                              size="small"
                              variant={link.is_active === 1 ? "filled" : "outlined"}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatDate(link.last_seen_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {domainDetails.details.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" sx={{ py: 2 }}>
                              No individual links found for this domain.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  
                  {domainDetails.details.length > 10 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Showing 10 of {domainDetails.details.length} links.
                      </Typography>
                    </Box>
                  )}
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExternalLinksTab; 