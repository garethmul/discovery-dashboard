import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Psychology as AIIcon,
  Category as CategoryIcon,
  Insights as InsightsIcon,
  Lightbulb as IdeaIcon,
  AutoAwesome as AwesomeIcon,
  Grade as StarIcon,
  Campaign as MarketingIcon,
  Business as BusinessIcon,
  Group as AudienceIcon,
  RecordVoiceOver as VoiceIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Helper to prettify names
const prettifyName = (name) => {
  if (!name) return '';
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AIAnalysisTab = ({ domainData }) => {
  const [tabValue, setTabValue] = useState(0);
  
  // Extract AI analysis data
  const aiAnalysis = domainData.aiAnalysis || {};
  const brandAnalysis = domainData.brandAnalysis || {};
  const contentCategories = domainData.contentCategories || [];
  const appIdeas = domainData.appIdeas || [];
  const appSuggestions = domainData.appSuggestions || {};
  const features = domainData.features || [];
  const marketingTips = domainData.marketingTips || [];
  const aiContentCategories = domainData.aiContentCategories || [];
  const aiAppSuggestions = domainData.aiAppSuggestions || [];
  
  // Helper to determine if there's any data to show
  const hasData = (data) => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return false;
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Render brand analysis section
  const renderBrandAnalysis = () => {
    if (!hasData(brandAnalysis)) {
      return <Alert severity="info">No brand analysis data available</Alert>;
    }
    
    return (
      <Card>
        <CardHeader 
          title="Brand Analysis" 
          avatar={<BusinessIcon color="primary" />}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {brandAnalysis.industryCategory && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Industry Category</Typography>
                  <Typography variant="body1">{brandAnalysis.industryCategory}</Typography>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.businessType && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Business Type</Typography>
                  <Typography variant="body1">{brandAnalysis.businessType}</Typography>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.targetAudience && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <AudienceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                      <Typography variant="body1">{brandAnalysis.targetAudience}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.brandVoice && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <VoiceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Brand Voice</Typography>
                      <Typography variant="body1">{brandAnalysis.brandVoice}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.brandValues && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Brand Values</Typography>
                  <Typography variant="body1">{brandAnalysis.brandValues}</Typography>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.marketPosition && (
              <Grid item xs={12} sm={6} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Market Position</Typography>
                  <Typography variant="body1">{brandAnalysis.marketPosition}</Typography>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.competitiveAdvantage && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Competitive Advantage</Typography>
                  <Typography variant="body1">{brandAnalysis.competitiveAdvantage}</Typography>
                </Paper>
              </Grid>
            )}
            
            {brandAnalysis.keyDifferentiators && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Key Differentiators</Typography>
                  <Typography variant="body1">{brandAnalysis.keyDifferentiators}</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  // Render content categories
  const renderContentCategories = () => {
    const allCategories = [...contentCategories, ...aiContentCategories];
    
    if (!hasData(allCategories)) {
      return <Alert severity="info">No content categories available</Alert>;
    }
    
    return (
      <Card>
        <CardHeader 
          title="Content Categories" 
          avatar={<CategoryIcon color="primary" />}
          subheader={`${allCategories.length} categories identified`}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {allCategories.map((category, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Chip 
                  label={category.name || category.category || 'Unknown'}
                  color="primary"
                  variant="outlined"
                  sx={{ width: '100%', justifyContent: 'flex-start', px: 1, py: 2.5 }}
                />
              </Grid>
            ))}
          </Grid>
          
          {contentCategories.some(cat => cat.description) && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Detailed Categories</Typography>
              <List dense>
                {contentCategories.filter(cat => cat.description).map((category, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name} 
                      secondary={category.description} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render app ideas and suggestions
  const renderAppIdeas = () => {
    const hasAppIdeas = hasData(appIdeas);
    const hasAppSuggestions = hasData(appSuggestions);
    const hasAiAppSuggestions = hasData(aiAppSuggestions);
    
    if (!hasAppIdeas && !hasAppSuggestions && !hasAiAppSuggestions) {
      return <Alert severity="info">No app ideas or suggestions available</Alert>;
    }
    
    return (
      <Card>
        <CardHeader 
          title="App Ideas & Suggestions" 
          avatar={<IdeaIcon color="primary" />}
        />
        <Divider />
        <CardContent>
          {/* App Ideas */}
          {hasAppIdeas && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>App Ideas</Typography>
              
              {appIdeas.map((idea, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography><strong>Idea {idea.ideaNumber || index + 1}:</strong> {idea.headline}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{idea.description}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
          
          {/* App Suggestions */}
          {hasAppSuggestions && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Detailed App Suggestion</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">App Name Options</Typography>
                    <List dense disablePadding>
                      {appSuggestions.nameOption1 && (
                        <ListItem>
                          <ListItemText primary={`Option 1: ${appSuggestions.nameOption1}`} />
                        </ListItem>
                      )}
                      {appSuggestions.nameOption2 && (
                        <ListItem>
                          <ListItemText primary={`Option 2: ${appSuggestions.nameOption2}`} />
                        </ListItem>
                      )}
                      {appSuggestions.nameOption3 && (
                        <ListItem>
                          <ListItemText primary={`Option 3: ${appSuggestions.nameOption3}`} />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                </Grid>
                
                {appSuggestions.description && (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body1">{appSuggestions.description}</Typography>
                    </Paper>
                  </Grid>
                )}
                
                {appSuggestions.targetAudience && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                      <Typography variant="body1">{appSuggestions.targetAudience}</Typography>
                    </Paper>
                  </Grid>
                )}
                
                {appSuggestions.monetizationStrategy && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Monetization Strategy</Typography>
                      <Typography variant="body1">{appSuggestions.monetizationStrategy}</Typography>
                    </Paper>
                  </Grid>
                )}
                
                {appSuggestions.developmentTime && (
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">Development Time</Typography>
                      <Typography variant="body1">{appSuggestions.developmentTime}</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          
          {/* AI App Suggestions */}
          {hasAiAppSuggestions && (
            <Box>
              <Typography variant="h6" gutterBottom>AI App Suggestions</Typography>
              
              {aiAppSuggestions.map((suggestion, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography><strong>{suggestion.appName || `App Suggestion ${index + 1}`}</strong></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {suggestion.appDescription && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                          <Typography variant="body1">{suggestion.appDescription}</Typography>
                        </Grid>
                      )}
                      
                      {suggestion.targetAudience && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                          <Typography variant="body1">{suggestion.targetAudience}</Typography>
                        </Grid>
                      )}
                      
                      {suggestion.monetizationStrategy && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Monetization Strategy</Typography>
                          <Typography variant="body1">{suggestion.monetizationStrategy}</Typography>
                        </Grid>
                      )}
                      
                      {suggestion.technicalRequirements && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Technical Requirements</Typography>
                          <Typography variant="body1">{suggestion.technicalRequirements}</Typography>
                        </Grid>
                      )}
                      
                      {suggestion.developmentTimeEstimate && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Development Time</Typography>
                          <Typography variant="body1">{suggestion.developmentTimeEstimate}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render features
  const renderFeatures = () => {
    if (!hasData(features)) {
      return <Alert severity="info">No feature suggestions available</Alert>;
    }
    
    // Group features by priority if available
    const featuresWithPriority = features.filter(f => f.priority);
    const featuresWithoutPriority = features.filter(f => !f.priority);
    const priorityGroups = {};
    
    if (featuresWithPriority.length > 0) {
      featuresWithPriority.forEach(feature => {
        const priority = feature.priority.toLowerCase();
        if (!priorityGroups[priority]) {
          priorityGroups[priority] = [];
        }
        priorityGroups[priority].push(feature);
      });
    }
    
    return (
      <Card>
        <CardHeader 
          title="Feature Suggestions" 
          avatar={<StarIcon color="primary" />}
          subheader={`${features.length} features suggested`}
        />
        <Divider />
        <CardContent>
          {Object.keys(priorityGroups).length > 0 ? (
            <>
              {/* High Priority Features */}
              {priorityGroups.high && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: 'error.main', 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1,
                  }}>
                    <StarIcon sx={{ mr: 1 }} /> High Priority Features
                  </Typography>
                  <Grid container spacing={2}>
                    {priorityGroups.high.map((feature, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2">{feature.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Medium Priority Features */}
              {priorityGroups.medium && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: 'warning.main', 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1,
                  }}>
                    <StarIcon sx={{ mr: 1 }} /> Medium Priority Features
                  </Typography>
                  <Grid container spacing={2}>
                    {priorityGroups.medium.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2">{feature.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
              {/* Low Priority Features */}
              {priorityGroups.low && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: 'info.main', 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 1,
                  }}>
                    <StarIcon sx={{ mr: 1 }} /> Low Priority Features
                  </Typography>
                  <Grid container spacing={2}>
                    {priorityGroups.low.map((feature, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2">{feature.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          ) : (
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2">{feature.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Features without priority */}
          {featuresWithoutPriority.length > 0 && Object.keys(priorityGroups).length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Other Features</Typography>
              <Grid container spacing={2}>
                {featuresWithoutPriority.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2">{feature.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render marketing tips
  const renderMarketingTips = () => {
    if (!hasData(marketingTips)) {
      return <Alert severity="info">No marketing tips available</Alert>;
    }
    
    // Group tips by category if available
    const categories = {};
    
    marketingTips.forEach(tip => {
      const category = tip.category || 'General';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(tip);
    });
    
    return (
      <Card>
        <CardHeader 
          title="Marketing Tips" 
          avatar={<MarketingIcon color="primary" />}
          subheader={`${marketingTips.length} tips suggested`}
        />
        <Divider />
        <CardContent>
          {Object.keys(categories).length > 1 ? (
            <>
              {Object.entries(categories).map(([category, tips], categoryIndex) => (
                <Box key={categoryIndex} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>{category}</Typography>
                  <List dense>
                    {tips.map((tip, tipIndex) => (
                      <ListItem key={tipIndex}>
                        <ListItemIcon>
                          <MarketingIcon />
                        </ListItemIcon>
                        <ListItemText primary={tip.tipText} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </>
          ) : (
            <List dense>
              {marketingTips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <MarketingIcon />
                  </ListItemIcon>
                  <ListItemText primary={tip.tipText} />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Render raw AI analysis data
  const renderRawAIAnalysis = () => {
    if (!hasData(aiAnalysis)) {
      return <Alert severity="info">No raw AI analysis data available</Alert>;
    }
    
    // Check if it's just a data field
    const data = aiAnalysis.data || aiAnalysis;
    
    // If it's a simple string, display it
    if (typeof data === 'string') {
      return (
        <Card>
          <CardHeader title="AI Analysis Data" avatar={<AIIcon color="primary" />} />
          <Divider />
          <CardContent>
            <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {data}
            </Typography>
          </CardContent>
        </Card>
      );
    }
    
    // If it's an object, render the fields
    return (
      <Card>
        <CardHeader 
          title="AI Analysis Data" 
          avatar={<AIIcon color="primary" />}
          subheader={aiAnalysis._source ? `Source: ${aiAnalysis._source}` : null}
        />
        <Divider />
        <CardContent>
          {Object.entries(data).filter(([key]) => key !== '_source').map(([key, value], index) => {
            if (typeof value === 'object' && value !== null) {
              return (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{prettifyName(key)}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(value, null, 2)}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            }
            
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{prettifyName(key)}</Typography>
                <Typography variant="body1">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </Typography>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    );
  };
  
  // No data to display
  if (!hasData(aiAnalysis) && !hasData(brandAnalysis) && !hasData(contentCategories) 
      && !hasData(appIdeas) && !hasData(appSuggestions) && !hasData(features)
      && !hasData(marketingTips) && !hasData(aiContentCategories) && !hasData(aiAppSuggestions)) {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          AI Analysis
        </Typography>
        <Alert severity="info">
          No AI analysis data is available for this domain. The crawler may not have run AI analysis on this site.
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        AI Analysis
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<BusinessIcon />} label="Brand" />
          <Tab icon={<CategoryIcon />} label="Categories" />
          <Tab icon={<IdeaIcon />} label="App Ideas" />
          <Tab icon={<StarIcon />} label="Features" />
          <Tab icon={<MarketingIcon />} label="Marketing" />
          <Tab icon={<AwesomeIcon />} label="Raw AI Data" />
        </Tabs>
      </Paper>
      
      <Box role="tabpanel" hidden={tabValue !== 0} sx={{ mb: 3 }}>
        {tabValue === 0 && renderBrandAnalysis()}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1} sx={{ mb: 3 }}>
        {tabValue === 1 && renderContentCategories()}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 2} sx={{ mb: 3 }}>
        {tabValue === 2 && renderAppIdeas()}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 3} sx={{ mb: 3 }}>
        {tabValue === 3 && renderFeatures()}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 4} sx={{ mb: 3 }}>
        {tabValue === 4 && renderMarketingTips()}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 5} sx={{ mb: 3 }}>
        {tabValue === 5 && renderRawAIAnalysis()}
      </Box>
    </Box>
  );
};

export default AIAnalysisTab; 