import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

const PlaceholderTab = ({ tabName, domainData, dataField }) => {
  // Check if this data section exists in the domain data
  const hasData = dataField && domainData && domainData[dataField] && (
    Array.isArray(domainData[dataField]) 
      ? domainData[dataField].length > 0 
      : Object.keys(domainData[dataField]).length > 0
  );
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {tabName || 'Tab Content'}
      </Typography>
      
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <ConstructionIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          This tab is under construction
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          The content for this section is being developed. Check back soon!
        </Typography>
      </Paper>
      
      {dataField && (
        <>
          {hasData ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Raw Data Preview
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Here's a preview of the raw data available for this section:
              </Typography>
              
              <Divider sx={{ mb: 2 }} />
              
              {Array.isArray(domainData[dataField]) ? (
                <List>
                  {domainData[dataField].slice(0, 5).map((item, index) => (
                    <ListItem key={index} divider={index < Math.min(4, domainData[dataField].length - 1)}>
                      <ListItemText
                        primary={`Item ${index + 1}`}
                        secondary={
                          <Box
                            component="pre"
                            sx={{ 
                              whiteSpace: 'pre-wrap',
                              maxHeight: 100,
                              overflow: 'auto',
                              fontSize: '0.8rem',
                              m: 0,
                              fontFamily: 'monospace'
                            }}
                          >
                            {JSON.stringify(item, null, 2)}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                  {domainData[dataField].length > 5 && (
                    <ListItem>
                      <ListItemText 
                        primary={`+ ${domainData[dataField].length - 5} more items`}
                        secondary="Full data will be available in the completed tab"
                      />
                    </ListItem>
                  )}
                </List>
              ) : (
                <Box>
                  <Box
                    component="pre" 
                    sx={{ 
                      whiteSpace: 'pre-wrap', 
                      maxHeight: 300, 
                      overflow: 'auto',
                      fontSize: '0.8rem',
                      bgcolor: 'background.default',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      m: 0
                    }}
                  >
                    {JSON.stringify(domainData[dataField], null, 2)}
                  </Box>
                </Box>
              )}
            </Paper>
          ) : (
            <Alert severity="info">
              <AlertTitle>No Data Available</AlertTitle>
              There is no data available for this section in the current domain.
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default PlaceholderTab; 