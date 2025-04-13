import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Card, 
  CardContent,
  CardHeader, 
  Divider
} from '@mui/material';

const GeneralTab = ({ domainData }) => {
  // Extract the general data from the domain data
  const general = domainData.general || {};
  const metadata = domainData.metadata || {};

  // Helper function to check if an object has any data worth showing
  const hasData = (obj) => {
    if (!obj) return false;
    return Object.keys(obj).some(key => {
      const value = obj[key];
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'object' && Object.keys(value).length === 0) return false;
      return true;
    });
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        General Information
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Domain Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Domain Overview" />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Domain Name" 
                    secondary={domainData.domainName} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={domainData.status || 'N/A'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Last Crawled" 
                    secondary={domainData.lastScraped ? new Date(domainData.lastScraped).toLocaleString() : 'N/A'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Metadata */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Website Metadata" />
            <Divider />
            <CardContent>
              {hasData(metadata) ? (
                <List dense>
                  {metadata.title && (
                    <ListItem>
                      <ListItemText 
                        primary="Site Title" 
                        secondary={metadata.title} 
                      />
                    </ListItem>
                  )}
                  {metadata.description && (
                    <ListItem>
                      <ListItemText 
                        primary="Description" 
                        secondary={metadata.description} 
                      />
                    </ListItem>
                  )}
                  {metadata.logoUrl && (
                    <ListItem>
                      <ListItemText 
                        primary="Logo URL" 
                        secondary={metadata.logoUrl}
                      />
                    </ListItem>
                  )}
                  {metadata.themeColor && (
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemText 
                          primary="Theme Color" 
                          secondary={metadata.themeColor} 
                        />
                        <Box 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            backgroundColor: metadata.themeColor,
                            marginLeft: 2,
                            border: '1px solid #ddd'
                          }} 
                        />
                      </Box>
                    </ListItem>
                  )}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No metadata available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        {general.contactInfo && hasData(general.contactInfo) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Contact Information" />
              <Divider />
              <CardContent>
                <List dense>
                  {general.contactInfo.email && (
                    <ListItem>
                      <ListItemText 
                        primary="Email" 
                        secondary={general.contactInfo.email} 
                      />
                    </ListItem>
                  )}
                  {general.contactInfo.phone && (
                    <ListItem>
                      <ListItemText 
                        primary="Phone" 
                        secondary={general.contactInfo.phone} 
                      />
                    </ListItem>
                  )}
                  {general.contactInfo.address && (
                    <ListItem>
                      <ListItemText 
                        primary="Address" 
                        secondary={general.contactInfo.address} 
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Location Information */}
        {general.location && hasData(general.location) && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Location Information" />
              <Divider />
              <CardContent>
                <List dense>
                  {general.location.country && (
                    <ListItem>
                      <ListItemText 
                        primary="Country" 
                        secondary={general.location.country} 
                      />
                    </ListItem>
                  )}
                  {general.location.city && (
                    <ListItem>
                      <ListItemText 
                        primary="City" 
                        secondary={general.location.city} 
                      />
                    </ListItem>
                  )}
                  {general.location.region && (
                    <ListItem>
                      <ListItemText 
                        primary="Region" 
                        secondary={general.location.region} 
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Business Hours */}
        {general.businessHours && hasData(general.businessHours) && (
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Business Hours" />
              <Divider />
              <CardContent>
                <List dense>
                  {Object.entries(general.businessHours).map(([day, hours]) => (
                    <ListItem key={day}>
                      <ListItemText 
                        primary={day.charAt(0).toUpperCase() + day.slice(1)} 
                        secondary={hours} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Categories */}
        {general.categories && Array.isArray(general.categories) && general.categories.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Categories" />
              <Divider />
              <CardContent>
                <List dense>
                  {general.categories.map((category, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={category} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default GeneralTab; 