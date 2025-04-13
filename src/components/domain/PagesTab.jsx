import React, { useState, useEffect } from 'react';
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
  Divider,
  Alert,
  CircularProgress,
  Button,
  Chip,
  Link
} from '@mui/material';
import { domainApi } from '../../services/api';

const PagesTab = ({ domainData }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchPages = async () => {
      if (!domainData?.id) return;
      
      setLoading(true);
      try {
        const pagesData = await domainApi.getDomainPages(domainData.id);
        setPages(pagesData || []);
      } catch (err) {
        console.error('Error fetching domain pages:', err);
        setError('Failed to load pages data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [domainData?.id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pages Information
      </Typography>
      <Typography variant="body1" paragraph>
        This tab displays crawled web pages for {domainData?.domainName || 'this domain'}.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      ) : pages.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No pages information available for this domain.
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="domain pages table">
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Crawled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((pageItem, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Link href={pageItem.url} target="_blank" rel="noopener noreferrer">
                          {pageItem.url}
                        </Link>
                      </TableCell>
                      <TableCell>{pageItem.title || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small"
                          label={pageItem.status || 'Unknown'} 
                          color={pageItem.status === 200 ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{formatDate(pageItem.crawlDate)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={pages.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default PagesTab; 