import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import youtubeRoutes from './src/routes/youtubeRoutes.js';
import logger from './src/utils/logger.js';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.BACKEND_PORT || 3010;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Mount YouTube routes
app.use('/api/youtube', youtubeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}`);
}); 