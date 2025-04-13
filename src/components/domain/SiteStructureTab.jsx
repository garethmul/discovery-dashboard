import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Chip,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Link as LinkIcon,
  WebAsset as PageIcon,
  FolderOpen as FolderIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

const SiteStructureTab = ({ domainData }) => {
  const [expandedSections, setExpandedSections] = useState({});
  
  // Get the site structure data
  const siteStructure = domainData.siteStructure || {};
  const site_structure = siteStructure.site_structure || {};
  const prominent_links = siteStructure.prominent_links || [];
  const navigation_structure = siteStructure.navigation_structure || {};
  
  // Helper function to toggle expanded sections
  const toggleExpand = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Helper function to check if an object has data
  const hasData = (obj) => {
    if (!obj) return false;
    if (Array.isArray(obj)) return obj.length > 0;
    return Object.keys(obj).length > 0;
  };
  
  // Recursively render site structure categories
  const renderCategories = (categories, level = 0) => {
    if (!categories || Object.keys(categories).length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ pl: level * 2 }}>
          No categories available
        </Typography>
      );
    }
    
    return (
      <List dense disablePadding>
        {Object.entries(categories).map(([categoryName, categoryData], index) => {
          const categoryId = `category-${level}-${index}`;
          const isExpanded = expandedSections[categoryId] || false;
          
          return (
            <React.Fragment key={categoryId}>
              <ListItem 
                sx={{ pl: level * 2 }}
                disablePadding
              >
                <ListItemButton onClick={() => toggleExpand(categoryId)}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={categoryName} 
                    secondary={`${categoryData.pages ? categoryData.pages.length : 0} pages`} 
                  />
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>
              
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                {categoryData.pages && categoryData.pages.length > 0 && (
                  <List dense disablePadding sx={{ pl: (level + 1) * 2 }}>
                    {categoryData.pages.map((page, pageIndex) => (
                      <ListItem 
                        key={`${categoryId}-page-${pageIndex}`}
                        disablePadding
                      >
                        <ListItemButton 
                          component="a" 
                          href={page.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ListItemIcon>
                            <PageIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={page.title || page.url} 
                            secondary={page.url} 
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {categoryData.subcategories && Object.keys(categoryData.subcategories).length > 0 && (
                  <Box sx={{ pl: 2 }}>
                    {renderCategories(categoryData.subcategories, level + 1)}
                  </Box>
                )}
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    );
  };
  
  // Render a navigation menu
  const renderNavMenu = (menu, menuName) => {
    if (!menu || !Array.isArray(menu) || menu.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          No {menuName} available
        </Typography>
      );
    }
    
    return (
      <List dense>
        {menu.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton 
              component="a" 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              disabled={!item.url}
            >
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText 
                primary={item.text || 'Unnamed Link'} 
                secondary={item.url || 'No URL'} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Site Structure
      </Typography>
      
      {Object.keys(siteStructure).length === 0 ? (
        <Alert severity="info">No site structure data available</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Site Metadata */}
          {site_structure.meta && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Site Metadata" />
                <Divider />
                <CardContent>
                  <List dense>
                    {site_structure.meta.title && (
                      <ListItem>
                        <ListItemText 
                          primary="Title" 
                          secondary={site_structure.meta.title} 
                        />
                      </ListItem>
                    )}
                    {site_structure.meta.description && (
                      <ListItem>
                        <ListItemText 
                          primary="Description" 
                          secondary={site_structure.meta.description} 
                        />
                      </ListItem>
                    )}
                    {site_structure.meta.keywords && (
                      <ListItem>
                        <ListItemText 
                          primary="Keywords" 
                          secondary={site_structure.meta.keywords} 
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Categories */}
          <Grid item xs={12}>
            <Card>
              <CardHeader 
                title="Site Categories" 
                subheader={site_structure.categories ? `${Object.keys(site_structure.categories).length} categories` : 'No categories found'} 
              />
              <Divider />
              <CardContent>
                {site_structure.categories ? (
                  renderCategories(site_structure.categories)
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No category data available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Navigation Structure */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Navigation Menus" />
              <Divider />
              <CardContent>
                {hasData(navigation_structure) ? (
                  <Box>
                    {navigation_structure.mainNav && (
                      <Box mb={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          Main Navigation
                        </Typography>
                        {renderNavMenu(navigation_structure.mainNav, 'main navigation')}
                      </Box>
                    )}
                    
                    {navigation_structure.footerNav && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Footer Navigation
                        </Typography>
                        {renderNavMenu(navigation_structure.footerNav, 'footer navigation')}
                      </Box>
                    )}
                    
                    {Object.entries(navigation_structure).filter(([key]) => !['mainNav', 'footerNav'].includes(key)).map(([menuName, menuItems]) => (
                      <Box key={menuName} mt={3}>
                        <Typography variant="subtitle1" gutterBottom>
                          {menuName.charAt(0).toUpperCase() + menuName.slice(1)}
                        </Typography>
                        {renderNavMenu(menuItems, menuName)}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No navigation structure available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Prominent Links */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader 
                title="Prominent Links" 
                subheader={`${prominent_links.length} links found`} 
              />
              <Divider />
              <CardContent>
                {prominent_links.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Text</TableCell>
                          <TableCell>URL</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {prominent_links.map((link, index) => (
                          <TableRow key={index}>
                            <TableCell>{link.text || 'Unnamed Link'}</TableCell>
                            <TableCell>
                              {link.url ? (
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                  {link.url}
                                </a>
                              ) : (
                                'No URL'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No prominent links available
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Page Statistics */}
          {(site_structure.totalPages !== undefined || site_structure.sections) && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Page Statistics" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    {site_structure.totalPages !== undefined && (
                      <Grid item xs={12} sm={4}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">{site_structure.totalPages}</Typography>
                          <Typography variant="subtitle2" color="text.secondary">Total Pages</Typography>
                        </Paper>
                      </Grid>
                    )}
                    
                    {site_structure.sections && (
                      <Grid item xs={12} sm={4}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">{site_structure.sections.length}</Typography>
                          <Typography variant="subtitle2" color="text.secondary">Site Sections</Typography>
                        </Paper>
                      </Grid>
                    )}
                    
                    {site_structure.categories && (
                      <Grid item xs={12} sm={4}>
                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4">{Object.keys(site_structure.categories).length}</Typography>
                          <Typography variant="subtitle2" color="text.secondary">Categories</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Site Sections */}
          {site_structure.sections && site_structure.sections.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Site Sections" />
                <Divider />
                <CardContent>
                  <List dense>
                    {site_structure.sections.map((section, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DocumentIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={section.name || `Section ${index + 1}`} 
                          secondary={section.description || 'No description'} 
                        />
                        {section.url && (
                          <Chip 
                            label="View" 
                            component="a" 
                            href={section.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            clickable 
                            size="small" 
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Data Source Information */}
          {siteStructure._source && (
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Data Source Information" />
                <Divider />
                <CardContent>
                  <Typography variant="body2">
                    Source: {siteStructure._source}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SiteStructureTab; 