import { OpenAI } from 'openai';
import logger from '../src/utils/logger.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// OpenAI configuration
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
};

// Create OpenAI client (only if API key is provided)
let openai = null;
/* Commented out OpenAI initialization as it's not needed at the moment
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI(openaiConfig);
    logger.info('OpenAI client initialized successfully');
  }
} catch (error) {
  logger.error(`Error initializing OpenAI client: ${error.message}`);
}
*/
logger.info('OpenAI client initialization skipped (commented out)');

// Test OpenAI API connection
const testConnection = async () => {
  // Return false as OpenAI connection is skipped
  logger.info('OpenAI API connection test skipped (commented out)');
  return false;
  
  /* Commented out OpenAI connection test as it's not needed at the moment
  try {
    // If no API key is provided, return false
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('OpenAI API key not provided');
      return false;
    }
    
    // If openai client wasn't initialized, try again
    if (!openai) {
      try {
        openai = new OpenAI(openaiConfig);
      } catch (initError) {
        logger.error(`Error initializing OpenAI client: ${initError.message}`);
        return false;
      }
    }
    
    // Simple test to verify the API key works
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Test connection' }
      ],
      max_tokens: 5
    });
    
    logger.info('OpenAI API connection established successfully');
    return true;
  } catch (error) {
    logger.error(`OpenAI API connection failed: ${error.message}`);
    return false;
  }
  */
};

export { openai, testConnection }; 