import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Language as LanguageIcon,
  BugReport as CrawlerIcon,
  Storage as DatabaseIcon,
  Analytics as AnalyticsIcon,
  BarChart as ChartIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Domains', icon: <LanguageIcon />, path: '/domains' },
    { text: 'Crawler Status', icon: <CrawlerIcon />, path: '/crawler-status' },
    { text: 'Database Tables', icon: <DatabaseIcon />, path: '/tables' },
  ];

  const analysisMenuItems = [
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Reports', icon: <ChartIcon />, path: '/reports' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          display: { xs: 'none', sm: 'block' } 
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={isActive(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          <ListItem>
            <Typography variant="overline" color="textSecondary">
              Analysis
            </Typography>
          </ListItem>
          {analysisMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={isActive(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <List>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/settings')}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 