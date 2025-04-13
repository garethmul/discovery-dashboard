import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Divider,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Article as ArticleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  ImageNotSupported as NoImageIcon
} from '@mui/icons-material';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

const BlogTab = ({ domainData }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  // Extract blog data
  const blog = domainData.blog || {};
  const hasBlog = blog.hasBlog || false;
  const articles = blog.articles || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const displayedArticles = articles.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Handle article click to show details
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };
  
  // Close article dialog
  const handleCloseDialog = () => {
    setSelectedArticle(null);
  };
  
  // Display blog info
  const renderBlogInfo = () => {
    return (
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Blog Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Blog URL</Typography>
                <Typography variant="body1">
                  {blog.blogUrl ? (
                    <a href={blog.blogUrl} target="_blank" rel="noopener noreferrer">
                      {blog.blogUrl}
                    </a>
                  ) : 'Not available'}
                </Typography>
              </Paper>
            </Grid>
            
            {blog.blogTitle && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Blog Title</Typography>
                  <Typography variant="body1">{blog.blogTitle}</Typography>
                </Paper>
              </Grid>
            )}
            
            {blog.blogType && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Blog Type</Typography>
                  <Typography variant="body1">{blog.blogType}</Typography>
                </Paper>
              </Grid>
            )}
            
            {blog.estimatedPostCount !== undefined && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Estimated Posts</Typography>
                  <Typography variant="body1">{blog.estimatedPostCount}</Typography>
                </Paper>
              </Grid>
            )}
            
            {blog.latestPostDate && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Latest Post</Typography>
                  <Typography variant="body1">{formatDate(blog.latestPostDate)}</Typography>
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Articles Found</Typography>
                <Typography variant="body1">{articles.length}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  // Article card
  const renderArticleCard = (article, index) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {article.imageUrl ? (
            <CardMedia
              component="img"
              height="140"
              image={article.imageUrl}
              alt={article.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <Box 
              sx={{ 
                height: 100, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'action.hover' 
              }}
            >
              <NoImageIcon color="disabled" sx={{ fontSize: 40 }} />
            </Box>
          )}
          
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {article.title || 'Untitled Article'}
            </Typography>
            
            {article.publishDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(article.publishDate)}
                </Typography>
              </Box>
            )}
            
            {article.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {article.author}
                </Typography>
              </Box>
            )}
            
            {article.excerpt && (
              <Typography variant="body2" color="text.secondary" sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {article.excerpt}
              </Typography>
            )}
          </CardContent>
          
          <CardActions>
            {article.url && (
              <Button 
                size="small" 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                startIcon={<LinkIcon />}
              >
                View
              </Button>
            )}
            <Button 
              size="small" 
              onClick={() => handleArticleClick(article)}
              startIcon={<ArticleIcon />}
            >
              Details
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Blog Content
      </Typography>
      
      {!hasBlog && articles.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No blog content was found for this domain.
        </Alert>
      ) : (
        <>
          {renderBlogInfo()}
          
          {articles.length > 0 ? (
            <>
              <Typography variant="h6" component="h3" gutterBottom>
                Articles ({articles.length})
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {displayedArticles.map((article, index) => renderArticleCard(article, index))}
              </Grid>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="primary" 
                  />
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info">
              Blog was detected, but no articles were extracted.
            </Alert>
          )}
        </>
      )}
      
      {/* Article Details Dialog */}
      <Dialog
        open={!!selectedArticle}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedArticle && (
          <>
            <DialogTitle>
              {selectedArticle.title || 'Article Details'}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                {selectedArticle.imageUrl && (
                  <Grid item xs={12}>
                    <Box sx={{ maxHeight: 300, overflow: 'hidden', mb: 2 }}>
                      <img 
                        src={selectedArticle.imageUrl} 
                        alt={selectedArticle.title}
                        style={{ width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <List>
                    {selectedArticle.publishDate && (
                      <ListItem>
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Publication Date" 
                          secondary={formatDate(selectedArticle.publishDate)} 
                        />
                      </ListItem>
                    )}
                    
                    {selectedArticle.author && (
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Author" 
                          secondary={selectedArticle.author} 
                        />
                      </ListItem>
                    )}
                    
                    {selectedArticle.url && (
                      <ListItem>
                        <ListItemIcon>
                          <LinkIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="URL" 
                          secondary={
                            <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                              {selectedArticle.url}
                            </a>
                          } 
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                
                {selectedArticle.excerpt && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Excerpt</Typography>
                    <Typography variant="body1" paragraph>
                      {selectedArticle.excerpt}
                    </Typography>
                  </Grid>
                )}
                
                {selectedArticle.content && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Content</Typography>
                    <Typography variant="body1" component="div">
                      <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                    </Typography>
                  </Grid>
                )}
                
                {selectedArticle.categories && selectedArticle.categories.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Categories</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedArticle.categories.map((category, index) => (
                        <Chip key={index} label={category} size="small" />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Tags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedArticle.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedArticle.url && (
                <Button 
                  href={selectedArticle.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Original
                </Button>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BlogTab; 