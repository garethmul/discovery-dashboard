/**
 * Logger utility with both console and file output
 * Cache-busting timestamp: ${new Date().toISOString()}
 */
import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'server.log');

const writeToFile = (level, message) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logMessage = `${timestamp} ${level}: ${message}\n`;
  
  // Write to file
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.log(`${timestamp} info: ${message}`);
    writeToFile('info', message);
  },
  
  warn: (message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.warn(`${timestamp} warn: ${message}`);
    writeToFile('warn', message);
  },
  
  error: (message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    console.error(`${timestamp} error: ${message}`);
    writeToFile('error', message);
  },
  
  debug: (message) => {
    if (process.env.DEBUG) {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      console.debug(`${timestamp} debug: ${message}`);
      writeToFile('debug', message);
    }
  }
};

export default logger; 