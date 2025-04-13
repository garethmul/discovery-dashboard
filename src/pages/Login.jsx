import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined as LockIcon
} from '@mui/icons-material';
import { authApi } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    apiKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };
  
  // Handle login with API key
  const handleApiKeyLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.apiKey.trim()) {
      setErrorMessage('Please enter an API key');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      // For API key login, we just store the key in localStorage
      localStorage.setItem('apiToken', credentials.apiKey);
      
      // Redirect to the intended page or home page
      const redirectPath = location.state?.from || '/';
      navigate(redirectPath);
    } catch (error) {
      setErrorMessage('Invalid API key');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle login with username/password
  const handleUsernamePasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setErrorMessage('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      await authApi.login({
        username: credentials.username,
        password: credentials.password
      });
      
      // Redirect to the intended page or home page
      const redirectPath = location.state?.from || '/';
      navigate(redirectPath);
    } catch (error) {
      setErrorMessage('Invalid username or password');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: 'background.paper'
        }}
      >
        <Box 
          sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'primary.light', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            mb: 2
          }}
        >
          <LockIcon fontSize="large" sx={{ color: 'primary.contrastText' }} />
        </Box>
        
        <Typography component="h1" variant="h4" gutterBottom>
          Domain Crawler Dashboard
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
          Sign in to access the dashboard
        </Typography>
        
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        
        <Box 
          component="form" 
          onSubmit={handleApiKeyLogin} 
          sx={{ width: '100%', mb: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Sign in with API Key
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="apiKey"
            label="API Key"
            name="apiKey"
            autoComplete="off"
            value={credentials.apiKey}
            onChange={handleChange}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle api key visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In with API Key'}
          </Button>
        </Box>
        
        <Box sx={{ width: '100%', my: 2 }}>
          <Divider>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
        </Box>
        
        <Box 
          component="form" 
          onSubmit={handleUsernamePasswordLogin} 
          sx={{ width: '100%' }}
        >
          <Typography variant="h6" gutterBottom>
            Sign in with Username and Password
          </Typography>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={credentials.username}
            onChange={handleChange}
            variant="outlined"
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In with Username'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 