import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { domainApi } from '../services/api';

// Helper to format date strings
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const DomainList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('search') || '';
  
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await domainApi.getAllDomains();
      setDomains(data);
      filterDomains(data, searchTerm);
    } catch (err) {
      setError('Failed to fetch domains. Please try again later.');
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Client-side filtering function
  const filterDomains = (domainsToFilter, term) => {
    if (!term || term.trim() === '') {
      setFilteredDomains(domainsToFilter);
      return;
    }
    
    const lowercaseTerm = term.toLowerCase();
    const filtered = domainsToFilter.filter(domain => 
      domain.domain_name.toLowerCase().includes(lowercaseTerm) ||
      String(domain.id).includes(lowercaseTerm)
    );
    
    setFilteredDomains(filtered);
  };
  
  useEffect(() => {
    fetchDomains();
  }, []);
  
  useEffect(() => {
    // When search term in URL changes, update local state
    setSearchTerm(initialSearchTerm);
    // Filter based on the new term
    filterDomains(domains, initialSearchTerm);
  }, [initialSearchTerm]);
  
  const handleViewDomain = (domainId) => {
    // Use direct URL instead of navigate to avoid SPA routing issues
    window.location.href = `/domains/${domainId}`;
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL and maintain history
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    // Directly filter domains without refetching from API
    filterDomains(domains, searchTerm);
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
        size="small" 
      />
    );
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Crawled Domains
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDomains}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
          >
            Filter
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search domains"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="contained">Search</Button>
        </Box>
      </Paper>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}
      
      {!loading && !error && filteredDomains.length === 0 && (
        <Alert severity="info" sx={{ my: 2 }}>
          No domains found. {searchTerm ? 'Try adjusting your search.' : ''}
        </Alert>
      )}
      
      {!loading && !error && filteredDomains.length > 0 && (
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Domain Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Crawled</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDomains
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((domain) => (
                    <TableRow
                      key={domain.id}
                      hover
                      onClick={() => handleViewDomain(domain.id)}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer' // Show pointer cursor on hover
                      }}
                    >
                      <TableCell>{domain.id}</TableCell>
                      <TableCell>{domain.domain_name}</TableCell>
                      <TableCell>{getStatusChip(domain.status)}</TableCell>
                      <TableCell>{formatDate(domain.last_scraped_at)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="View domain details">
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDomain(domain.id);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredDomains.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default DomainList; 