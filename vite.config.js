import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['@emotion/react', '@emotion/styled', '@mui/material']
    },
    build: {
      commonjsOptions: {
        include: []
      },
      outDir: 'dist',
      assetsDir: 'assets'
    },
    server: {
      port: 5176,
      strictPort: true, // This will fail if port 5176 is already in use rather than trying another port
      proxy: {
        '/api': {
          target: 'http://localhost:3009',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
              // Log headers being sent
              console.log('Request Headers:', req.headers);
              
              // Ensure API key is forwarded if present
              const apiKey = req.headers['x-api-key'];
              if (apiKey) {
                proxyReq.setHeader('X-API-Key', apiKey);
                console.log('Forwarded API key:', apiKey);
              } else {
                console.warn('No API key in request headers');
                
                // Try to get from localStorage and add to proxy request
                if (typeof window !== 'undefined') {
                  const token = localStorage.getItem('apiToken');
                  if (token) {
                    proxyReq.setHeader('X-API-Key', token);
                    console.log('Added API key from localStorage:', token);
                  }
                }
              }
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
              // Log response headers
              console.log('Response Headers:', proxyRes.headers);
            });
          },
        },
        base: '/dashboard/'
      }
    }
  };
}); 