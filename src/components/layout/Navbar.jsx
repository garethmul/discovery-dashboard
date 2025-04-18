import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Menu,
  MenuItem,
  Button,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle,
  Settings
} from '@mui/icons-material';
import { authApi } from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Get search from URL or empty string
  const params = new URLSearchParams(location.search);
  const urlSearchQuery = params.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  
  // Sync searchQuery with URL when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";
    setSearchQuery(urlSearch);
  }, [location.search]);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
    handleClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use relative URL to keep user on current page
      const baseUrl = location.pathname.includes('/domains') ? '/domains' : '/';
      navigate(`${baseUrl}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', mr: 4 }}>
          Domain Crawler Dashboard
        </Typography>
        
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: alpha('#fff', 0.15),
            '&:hover': { backgroundColor: alpha('#fff', 0.25) },
            width: '100%',
            maxWidth: 500,
            mr: 2
          }}
        >
          <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', pl: 1 }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search domains..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              color: 'inherit',
              width: '100%',
              pl: 5,
              py: 1
            }}
          />
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box>
          <Button color="inherit" onClick={() => navigate('/')}>
            Domains
          </Button>
          
          <IconButton
            size="large"
            aria-label="account menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSettings}>
              <Settings fontSize="small" sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 