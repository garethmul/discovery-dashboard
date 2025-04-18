import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  Chip
} from '@mui/material';
import {
  Title as TitleIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';

const MetadataTab = ({ domainData }) => {
  // Extract metadata from all potential sources
  const metadata = domainData.metadata || {};
  // Also check domainData.data.metadata which is how it's stored from website_metadata table
  const dataMetadata = domainData.data?.metadata || {};
  
  // Merge metadata from different sources, prioritizing direct metadata if available
  const combinedMetadata = {
    ...dataMetadata,
    ...metadata
  };
  
  const opengraph = domainData.opengraph || [];
  
  // Flag to check if we have any metadata to display
  const hasMetadata = Object.keys(combinedMetadata).length > 0;
  const hasOpengraph = opengraph.length > 0;
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Website Metadata
      </Typography>
      
      {!hasMetadata && !hasOpengraph ? (
        <Alert severity="info">
          No metadata information available for this domain.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Core Metadata Card */}
          {hasMetadata && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Core Metadata" />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Title */}
                    {combinedMetadata.title && (
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <TitleIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                              <Typography variant="body1">{combinedMetadata.title}</Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                    
                    {/* Description */}
                    {combinedMetadata.description && (
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <DescriptionIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                              <Typography variant="body1">{combinedMetadata.description}</Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                    
                    {/* Logo URL */}
                    {combinedMetadata.logoUrl && (
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <ImageIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                            <Box sx={{ width: '100%' }}>
                              <Typography variant="subtitle2" color="text.secondary">Logo URL</Typography>
                              
                              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ maxWidth: 200, maxHeight: 100, overflow: 'hidden', mb: 1 }}>
                                  <img 
                                    src={combinedMetadata.logoUrl} 
                                    alt="Website Logo" 
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.parentNode.innerHTML += '<Typography variant="body2" color="error">Unable to load image</Typography>';
                                    }}
                                  />
                                </Box>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    wordBreak: 'break-all', 
                                    fontSize: '0.75rem',
                                    color: 'text.secondary'
                                  }}
                                >
                                  {combinedMetadata.logoUrl}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                    
                    {/* Theme Color */}
                    {combinedMetadata.themeColor && (
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <ColorIcon sx={{ color: 'primary.main', mr: 2, mt: 0.5 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Theme Color</Typography>
                              
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: combinedMetadata.themeColor,
                                    borderRadius: 1,
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    mr: 2
                                  }}
                                />
                                <Typography variant="body1">{combinedMetadata.themeColor}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* OpenGraph Data Card */}
          {hasOpengraph && (
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="OpenGraph Metadata" 
                  subheader={`${opengraph.length} OpenGraph tags found`}
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    {opengraph.map((og, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {og.url || `OpenGraph #${index + 1}`}
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={og.imageUrl ? 8 : 12}>
                              <List dense disablePadding>
                                {og.title && (
                                  <ListItem divider>
                                    <ListItemText 
                                      primary="Title" 
                                      secondary={og.title} 
                                    />
                                  </ListItem>
                                )}
                                
                                {og.description && (
                                  <ListItem divider>
                                    <ListItemText 
                                      primary="Description" 
                                      secondary={og.description} 
                                    />
                                  </ListItem>
                                )}
                                
                                {og.siteName && (
                                  <ListItem divider>
                                    <ListItemText 
                                      primary="Site Name" 
                                      secondary={og.siteName} 
                                    />
                                  </ListItem>
                                )}
                                
                                {og.type && (
                                  <ListItem divider>
                                    <ListItemText 
                                      primary="Type" 
                                      secondary={og.type} 
                                    />
                                  </ListItem>
                                )}
                                
                                {og.locale && (
                                  <ListItem divider>
                                    <ListItemText 
                                      primary="Locale" 
                                      secondary={og.locale} 
                                    />
                                  </ListItem>
                                )}
                                
                                {og.lastFetched && (
                                  <ListItem>
                                    <ListItemText 
                                      primary="Last Fetched" 
                                      secondary={new Date(og.lastFetched).toLocaleString()} 
                                    />
                                  </ListItem>
                                )}
                              </List>
                              
                              {og.platform && (
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                                    Platform:
                                  </Typography>
                                  <Chip 
                                    label={og.platform} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                  
                                  {og.isSocialProfile && (
                                    <Chip 
                                      label="Social Profile" 
                                      size="small" 
                                      color="secondary"
                                      variant="outlined"
                                      sx={{ ml: 1 }}
                                    />
                                  )}
                                </Box>
                              )}
                            </Grid>
                            
                            {og.imageUrl && (
                              <Grid item xs={12} md={4}>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                  <Box sx={{ maxWidth: '100%', maxHeight: 200, overflow: 'hidden' }}>
                                    <img 
                                      src={og.imageUrl} 
                                      alt="OpenGraph" 
                                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = '<Typography variant="body2" color="error">Unable to load image</Typography>';
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default MetadataTab; 