/**
 * Simple logger utility
 */
const logger = {
  info: (message) => {
    console.log(`[INFO] ${message}`);
  },
  
  warn: (message) => {
    console.warn(`[WARN] ${message}`);
  },
  
  error: (message) => {
    console.error(`[ERROR] ${message}`);
  },
  
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`);
    }
  }
};

export default logger; 