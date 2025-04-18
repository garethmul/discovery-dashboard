// This script runs before Heroku builds the app
// It manually deletes the package-lock.json file so npm install can recreate it

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the package-lock.json file
const packageLockPath = path.join(__dirname, 'package-lock.json');

// Check if package-lock.json exists
if (fs.existsSync(packageLockPath)) {
  console.log('Found package-lock.json, removing it...');
  try {
    // Delete the file
    fs.unlinkSync(packageLockPath);
    console.log('Successfully deleted package-lock.json');
  } catch (error) {
    console.error('Error deleting package-lock.json:', error);
  }
} else {
  console.log('package-lock.json not found, continuing...');
}

console.log('Heroku prebuild script completed'); 