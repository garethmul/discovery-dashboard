import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Create Express app
const app = express();
const server = http.createServer(app);

// Set port from environment variable or default to 3009
const PORT = process.env.PORT || 3009;

// Enable JSON parsing for API requests
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create jobs data file if it doesn't exist
const jobsDataPath = path.join(dataDir, 'jobs.json');
if (!fs.existsSync(jobsDataPath)) {
  fs.writeFileSync(jobsDataPath, JSON.stringify({
    jobs: []
  }));
}

// In-memory store for active jobs
let activeJobs = [];
let completedJobs = [];

// Load existing jobs data
try {
  const jobsData = JSON.parse(fs.readFileSync(jobsDataPath, 'utf8'));
  completedJobs = jobsData.jobs || [];
} catch (error) {
  console.error('Error loading jobs data:', error);
}

// API routes
app.get('/api/jobs', (req, res) => {
  console.log('GET /api/jobs - Returning jobs:', { activeCount: activeJobs.length, completedCount: completedJobs.length });
  res.json({
    active: activeJobs,
    completed: completedJobs
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;
  const activeJob = activeJobs.find(job => job.id === jobId);
  
  if (activeJob) {
    return res.json(activeJob);
  }
  
  const completedJob = completedJobs.find(job => job.id === jobId);
  
  if (completedJob) {
    return res.json(completedJob);
  }
  
  res.status(404).json({ error: 'Job not found' });
});

app.get('/api/jobs/:id/data', (req, res) => {
  const jobId = req.params.id;
  const jobDataPath = path.join(dataDir, `${jobId}.json`);
  
  if (fs.existsSync(jobDataPath)) {
    try {
      const jobData = JSON.parse(fs.readFileSync(jobDataPath, 'utf8'));
      return res.json(jobData);
    } catch (error) {
      return res.status(500).json({ error: 'Error reading job data' });
    }
  }
  
  res.status(404).json({ error: 'Job data not found' });
});

// Add a POST endpoint to create new jobs
app.post('/api/jobs', (req, res) => {
  const { name, description, type } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Job name is required' });
  }
  
  // Generate a unique ID for the job
  const jobId = generateUniqueId();
  
  // Create a new job
  const newJob = {
    id: jobId,
    name: name,
    description: description || 'No description provided',
    type: type || 'scraping',
    status: 'running',
    startTime: new Date().toISOString(),
    progress: 0
  };
  
  // Add the job to active jobs
  activeJobs.push(newJob);
  
  console.log('Created new job:', newJob);
  
  // Start job simulation
  simulateJobProgress(newJob);
  
  res.status(201).json(newJob);
});

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a dashboard index.html file
const indexPath = path.join(publicDir, 'index.html');
const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Discovery Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>
`;

fs.writeFileSync(indexPath, template);

// Sample job data for testing
const sampleJob = {
  id: '323e4567-e89b-12d3-a456-426614174002',
  name: 'Sample Scraping Job',
  status: 'running',
  startTime: new Date().toISOString(),
  progress: 0,
  description: 'This is a sample job for testing the dashboard'
};

// Add sample job to active jobs
activeJobs.push(sampleJob);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});

// Helper function to generate a unique ID
function generateUniqueId() {
  return 'job-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Function to simulate job progress
function simulateJobProgress(job) {
  let progress = 0;
  
  console.log(`Starting job simulation for: ${job.name} (${job.id})`);
  
  const progressInterval = setInterval(() => {
    progress += 5;
    
    if (progress <= 100) {
      // Update job progress
      job.progress = progress;
      job.status = 'Processing data (' + progress + '%)';
      
      console.log(`Job ${job.id} progress: ${progress}%`);
      
      // Save sample data for the job
      if (progress === 50) {
        const sampleData = {
          jobId: job.id,
          timestamp: new Date().toISOString(),
          results: [
            { id: 1, url: 'https://example.com/page1', title: 'Example Page 1', data: { key: 'value1' } },
            { id: 2, url: 'https://example.com/page2', title: 'Example Page 2', data: { key: 'value2' } },
            { id: 3, url: 'https://example.com/page3', title: 'Example Page 3', data: { key: 'value3' } }
          ]
        };
        
        fs.writeFileSync(path.join(dataDir, job.id + '.json'), JSON.stringify(sampleData, null, 2));
        
        console.log(`Job ${job.id} saved sample data at 50% progress`);
      }
    } else {
      // Complete the job
      clearInterval(progressInterval);
      
      const endTime = new Date().toISOString();
      const startTime = new Date(job.startTime);
      const endTimeObj = new Date(endTime);
      const durationMs = endTimeObj - startTime;
      const durationSec = Math.floor(durationMs / 1000);
      
      job.status = 'completed';
      job.progress = 100;
      job.endTime = endTime;
      job.duration = durationSec + ' seconds';
      
      // Move job from active to completed
      activeJobs = activeJobs.filter(j => j.id !== job.id);
      completedJobs.unshift(job);
      
      // Save completed jobs to file
      fs.writeFileSync(jobsDataPath, JSON.stringify({
        jobs: completedJobs
      }, null, 2));
    }
  }, 3000);
} 