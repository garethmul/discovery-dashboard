import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import path from 'path';
import fs from 'fs';

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

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
  
  // Emit job started event to all clients
  io.emit('job-started', newJob);
  
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
const dashboardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discovery Service Dashboard</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background-color: #2c3e50;
      color: white;
      padding: 15px 20px;
      margin-bottom: 20px;
    }
    h1, h2, h3 {
      margin: 0;
    }
    .card {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      overflow: hidden;
    }
    .card-header {
      background-color: #f8f9fa;
      padding: 15px 20px;
      border-bottom: 1px solid #e9ecef;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-body {
      padding: 20px;
    }
    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .status-running {
      background-color: #2ecc71;
    }
    .status-completed {
      background-color: #3498db;
    }
    .status-failed {
      background-color: #e74c3c;
    }
    .job-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .job-item {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .job-item:hover {
      background-color: #f8f9fa;
    }
    .job-item:last-child {
      border-bottom: none;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .job-title {
      font-weight: bold;
    }
    .job-meta {
      color: #6c757d;
      font-size: 0.9em;
    }
    .job-progress {
      margin-top: 10px;
      height: 8px;
      background-color: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    .job-progress-bar {
      height: 100%;
      background-color: #2ecc71;
      transition: width 0.3s ease;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    .tab.active {
      border-bottom-color: #3498db;
      font-weight: bold;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .data-viewer {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 15px;
      max-height: 400px;
      overflow-y: auto;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .connection-status {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 15px;
      border-radius: 4px;
      background-color: #2ecc71;
      color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transition: background-color 0.3s;
    }
    .connection-status.disconnected {
      background-color: #e74c3c;
    }
    .no-jobs {
      padding: 20px;
      text-align: center;
      color: #6c757d;
    }
    .log-entry {
      margin-bottom: 5px;
      padding: 5px;
      border-radius: 3px;
    }
    .log-info {
      background-color: #f8f9fa;
    }
    .log-warning {
      background-color: #fff3cd;
    }
    .log-error {
      background-color: #f8d7da;
    }
    .btn {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      cursor: pointer;
    }
    .btn-primary {
      color: #fff;
      background-color: #3498db;
      border-color: #3498db;
    }
    .btn-primary:hover {
      background-color: #2980b9;
      border-color: #2980b9;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      display: block;
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    .form-control:focus {
      color: #495057;
      background-color: #fff;
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 10% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 50%;
      border-radius: 5px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .modal-footer {
      border-top: 1px solid #dee2e6;
      padding-top: 20px;
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .close {
      color: #aaa;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    .close:hover {
      color: black;
    }
  </style>
</head>
<body>
  <header>
    <h1>Discovery Service Dashboard</h1>
  </header>
  
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2>Job Monitor</h2>
        <div>
          <button id="new-job-btn" class="btn btn-primary">New Job</button>
          <span id="refresh-status" style="margin-left: 15px;">Last updated: Never</span>
        </div>
      </div>
      <div class="tabs">
        <div class="tab active" data-tab="active-jobs">Active Jobs</div>
        <div class="tab" data-tab="completed-jobs">Completed Jobs</div>
        <div class="tab" data-tab="job-details">Job Details</div>
      </div>
      <div class="tab-content active" id="active-jobs">
        <div id="active-jobs-list" class="job-list">
          <div class="no-jobs">No active jobs</div>
        </div>
      </div>
      <div class="tab-content" id="completed-jobs">
        <div id="completed-jobs-list" class="job-list">
          <div class="no-jobs">No completed jobs</div>
        </div>
      </div>
      <div class="tab-content" id="job-details">
        <div class="card-body">
          <div id="job-details-content">
            <div class="no-jobs">Select a job to view details</div>
          </div>
          <div id="job-logs" style="margin-top: 20px; display: none;">
            <h3>Job Logs</h3>
            <div id="job-logs-content" class="data-viewer"></div>
          </div>
          <div id="job-data" style="margin-top: 20px; display: none;">
            <h3>Scraped Data</h3>
            <div id="job-data-content" class="data-viewer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- New Job Modal -->
  <div id="new-job-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Create New Job</h3>
        <span class="close">&times;</span>
      </div>
      <form id="new-job-form">
        <div class="form-group">
          <label for="job-name">Job Name</label>
          <input type="text" class="form-control" id="job-name" required>
        </div>
        <div class="form-group">
          <label for="job-description">Description</label>
          <textarea class="form-control" id="job-description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="job-type">Job Type</label>
          <select class="form-control" id="job-type">
            <option value="scraping">Web Scraping</option>
            <option value="data-processing">Data Processing</option>
            <option value="analysis">Data Analysis</option>
          </select>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" id="cancel-job-btn">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Job</button>
        </div>
      </form>
    </div>
  </div>
  
  <div id="connection-status" class="connection-status">
    Connected to server
  </div>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    // Connect to Socket.IO server
    const socket = io();
    const connectionStatus = document.getElementById('connection-status');
    const refreshStatus = document.getElementById('refresh-status');
    const activeJobsList = document.getElementById('active-jobs-list');
    const completedJobsList = document.getElementById('completed-jobs-list');
    const jobDetailsContent = document.getElementById('job-details-content');
    const jobLogsContent = document.getElementById('job-logs-content');
    const jobDataContent = document.getElementById('job-data-content');
    const jobLogsSection = document.getElementById('job-logs');
    const jobDataSection = document.getElementById('job-data');
    const newJobBtn = document.getElementById('new-job-btn');
    const newJobModal = document.getElementById('new-job-modal');
    const closeModalBtn = document.querySelector('.close');
    const cancelJobBtn = document.getElementById('cancel-job-btn');
    const newJobForm = document.getElementById('new-job-form');
    
    let selectedJobId = null;
    let activeJobs = [];
    let completedJobs = [];
    
    // Handle tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
      });
    });
    
    // New Job Modal
    newJobBtn.addEventListener('click', () => {
      newJobModal.style.display = 'block';
    });
    
    closeModalBtn.addEventListener('click', () => {
      newJobModal.style.display = 'none';
    });
    
    cancelJobBtn.addEventListener('click', () => {
      newJobModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
      if (event.target === newJobModal) {
        newJobModal.style.display = 'none';
      }
    });
    
    // Handle new job form submission
    newJobForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const jobName = document.getElementById('job-name').value;
      const jobDescription = document.getElementById('job-description').value;
      const jobType = document.getElementById('job-type').value;
      
      fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: jobName,
          description: jobDescription,
          type: jobType
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error creating job');
        }
        return response.json();
      })
      .then(job => {
        console.log('Job created:', job);
        newJobModal.style.display = 'none';
        newJobForm.reset();
        loadJobs();
      })
      .catch(error => {
        console.error('Error creating job:', error);
        alert('Error creating job: ' + error.message);
      });
    });
    
    // Socket connection events
    socket.on('connect', () => {
      connectionStatus.textContent = 'Connected to server';
      connectionStatus.classList.remove('disconnected');
      loadJobs();
    });
    
    socket.on('disconnect', () => {
      connectionStatus.textContent = 'Disconnected from server';
      connectionStatus.classList.add('disconnected');
    });
    
    // Job events
    socket.on('job-started', (job) => {
      console.log('Job started:', job);
      const existingIndex = activeJobs.findIndex(j => j.id === job.id);
      if (existingIndex >= 0) {
        activeJobs[existingIndex] = job;
      } else {
        activeJobs.push(job);
      }
      renderActiveJobs();
      updateJobDetails();
    });
    
    socket.on('job-updated', (job) => {
      console.log('Job updated:', job);
      const existingIndex = activeJobs.findIndex(j => j.id === job.id);
      if (existingIndex >= 0) {
        activeJobs[existingIndex] = job;
        renderActiveJobs();
        updateJobDetails();
      }
    });
    
    socket.on('job-completed', (job) => {
      console.log('Job completed:', job);
      activeJobs = activeJobs.filter(j => j.id !== job.id);
      const existingCompletedIndex = completedJobs.findIndex(j => j.id === job.id);
      if (existingCompletedIndex >= 0) {
        completedJobs[existingCompletedIndex] = job;
      } else {
        completedJobs.unshift(job);
      }
      renderActiveJobs();
      renderCompletedJobs();
      updateJobDetails();
    });
    
    socket.on('job-log', (data) => {
      if (selectedJobId === data.jobId) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry log-' + (data.level || 'info');
        logEntry.textContent = '[' + new Date(data.timestamp).toLocaleTimeString() + '] ' + data.message;
        jobLogsContent.appendChild(logEntry);
        jobLogsContent.scrollTop = jobLogsContent.scrollHeight;
        jobLogsSection.style.display = 'block';
      }
    });
    
    // Load jobs from API
    function loadJobs() {
      console.log('Loading jobs...');
      fetch('/api/jobs')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error loading jobs: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log('Jobs loaded:', data);
          activeJobs = data.active || [];
          completedJobs = data.completed || [];
          renderActiveJobs();
          renderCompletedJobs();
          updateRefreshStatus();
        })
        .catch(error => {
          console.error('Error loading jobs:', error);
          connectionStatus.textContent = 'Error: ' + error.message;
          connectionStatus.classList.add('disconnected');
        });
    }
    
    // Render active jobs
    function renderActiveJobs() {
      if (activeJobs.length === 0) {
        activeJobsList.innerHTML = '<div class="no-jobs">No active jobs</div>';
        return;
      }
      
      activeJobsList.innerHTML = '';
      activeJobs.forEach(job => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.dataset.jobId = job.id;
        
        const progress = job.progress || 0;
        const startTime = new Date(job.startTime).toLocaleString();
        
        const jobHeader = document.createElement('div');
        jobHeader.className = 'job-header';
        
        const jobTitle = document.createElement('div');
        jobTitle.className = 'job-title';
        
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator status-running';
        
        jobTitle.appendChild(statusIndicator);
        jobTitle.appendChild(document.createTextNode(job.name || 'Unnamed Job' + ' (' + job.id + ')'));
        
        const jobMeta = document.createElement('div');
        jobMeta.className = 'job-meta';
        jobMeta.textContent = startTime;
        
        jobHeader.appendChild(jobTitle);
        jobHeader.appendChild(jobMeta);
        
        const jobStatus = document.createElement('div');
        jobStatus.className = 'job-meta';
        jobStatus.textContent = job.status || 'Running';
        
        const jobProgressContainer = document.createElement('div');
        jobProgressContainer.className = 'job-progress';
        
        const jobProgressBar = document.createElement('div');
        jobProgressBar.className = 'job-progress-bar';
        jobProgressBar.style.width = progress + '%';
        
        jobProgressContainer.appendChild(jobProgressBar);
        
        jobItem.appendChild(jobHeader);
        jobItem.appendChild(jobStatus);
        jobItem.appendChild(jobProgressContainer);
        
        jobItem.addEventListener('click', () => selectJob(job.id));
        activeJobsList.appendChild(jobItem);
      });
    }
    
    // Render completed jobs
    function renderCompletedJobs() {
      if (completedJobs.length === 0) {
        completedJobsList.innerHTML = '<div class="no-jobs">No completed jobs</div>';
        return;
      }
      
      completedJobsList.innerHTML = '';
      completedJobs.forEach(job => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        jobItem.dataset.jobId = job.id;
        
        const startTime = new Date(job.startTime).toLocaleString();
        const endTime = job.endTime ? new Date(job.endTime).toLocaleString() : 'N/A';
        const statusClass = job.status === 'failed' ? 'status-failed' : 'status-completed';
        
        const jobHeader = document.createElement('div');
        jobHeader.className = 'job-header';
        
        const jobTitle = document.createElement('div');
        jobTitle.className = 'job-title';
        
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator ' + statusClass;
        
        jobTitle.appendChild(statusIndicator);
        jobTitle.appendChild(document.createTextNode(job.name || 'Unnamed Job' + ' (' + job.id + ')'));
        
        const jobMeta = document.createElement('div');
        jobMeta.className = 'job-meta';
        jobMeta.textContent = startTime;
        
        jobHeader.appendChild(jobTitle);
        jobHeader.appendChild(jobMeta);
        
        const jobStatus = document.createElement('div');
        jobStatus.className = 'job-meta';
        jobStatus.textContent = 'Status: ' + (job.status || 'Completed') + 
                               ' | Duration: ' + (job.duration || 'N/A') + 
                               ' | Completed: ' + endTime;
        
        jobItem.appendChild(jobHeader);
        jobItem.appendChild(jobStatus);
        
        jobItem.addEventListener('click', () => selectJob(job.id));
        completedJobsList.appendChild(jobItem);
      });
    }
    
    // Select a job to view details
    function selectJob(jobId) {
      selectedJobId = jobId;
      
      // Highlight selected job
      document.querySelectorAll('.job-item').forEach(item => {
        item.classList.remove('selected');
        if (item.dataset.jobId === jobId) {
          item.classList.add('selected');
        }
      });
      
      // Switch to job details tab
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.querySelector('.tab[data-tab="job-details"]').classList.add('active');
      document.getElementById('job-details').classList.add('active');
      
      // Clear previous logs
      jobLogsContent.innerHTML = '';
      jobLogsSection.style.display = 'none';
      
      // Load job details
      fetch('/api/jobs/' + jobId)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error loading job details');
          }
          return response.json();
        })
        .then(job => {
          const startTime = new Date(job.startTime).toLocaleString();
          const endTime = job.endTime ? new Date(job.endTime).toLocaleString() : 'N/A';
          const statusClass = job.status === 'failed' ? 'status-failed' : 
                             job.status === 'completed' ? 'status-completed' : 'status-running';
          
          jobDetailsContent.innerHTML = '';
          
          const jobTitle = document.createElement('h3');
          jobTitle.textContent = job.name || 'Unnamed Job';
          
          const jobId = document.createElement('p');
          const jobIdStrong = document.createElement('strong');
          jobIdStrong.textContent = 'ID: ';
          jobId.appendChild(jobIdStrong);
          jobId.appendChild(document.createTextNode(job.id));
          
          const jobStatus = document.createElement('p');
          const jobStatusStrong = document.createElement('strong');
          jobStatusStrong.textContent = 'Status: ';
          const statusIndicator = document.createElement('span');
          statusIndicator.className = 'status-indicator ' + statusClass;
          jobStatus.appendChild(jobStatusStrong);
          jobStatus.appendChild(statusIndicator);
          jobStatus.appendChild(document.createTextNode(' ' + (job.status || 'Running')));
          
          const jobStarted = document.createElement('p');
          const jobStartedStrong = document.createElement('strong');
          jobStartedStrong.textContent = 'Started: ';
          jobStarted.appendChild(jobStartedStrong);
          jobStarted.appendChild(document.createTextNode(startTime));
          
          const jobCompleted = document.createElement('p');
          const jobCompletedStrong = document.createElement('strong');
          jobCompletedStrong.textContent = 'Completed: ';
          jobCompleted.appendChild(jobCompletedStrong);
          jobCompleted.appendChild(document.createTextNode(endTime));
          
          const jobDuration = document.createElement('p');
          const jobDurationStrong = document.createElement('strong');
          jobDurationStrong.textContent = 'Duration: ';
          jobDuration.appendChild(jobDurationStrong);
          jobDuration.appendChild(document.createTextNode(job.duration || 'N/A'));
          
          const jobProgress = document.createElement('p');
          const jobProgressStrong = document.createElement('strong');
          jobProgressStrong.textContent = 'Progress: ';
          jobProgress.appendChild(jobProgressStrong);
          jobProgress.appendChild(document.createTextNode((job.progress || 0) + '%'));
          
          const jobDescription = document.createElement('p');
          const jobDescriptionStrong = document.createElement('strong');
          jobDescriptionStrong.textContent = 'Description: ';
          jobDescription.appendChild(jobDescriptionStrong);
          jobDescription.appendChild(document.createTextNode(job.description || 'No description'));
          
          jobDetailsContent.appendChild(jobTitle);
          jobDetailsContent.appendChild(jobId);
          jobDetailsContent.appendChild(jobStatus);
          jobDetailsContent.appendChild(jobStarted);
          jobDetailsContent.appendChild(jobCompleted);
          jobDetailsContent.appendChild(jobDuration);
          jobDetailsContent.appendChild(jobProgress);
          jobDetailsContent.appendChild(jobDescription);
          
          // Join the room for this job to get updates
          console.log('Joining room for job:', job.id);
          socket.emit('join', job.id);
          
          // Load job data
          loadJobData(job.id);
        })
        .catch(error => {
          console.error('Error loading job details:', error);
          jobDetailsContent.innerHTML = '<div class="no-jobs">Error loading job details</div>';
        });
    }
    
    // Load job data
    function loadJobData(jobId) {
      fetch('/api/jobs/' + jobId + '/data')
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              return null;
            }
            throw new Error('Error loading job data');
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            jobDataContent.textContent = JSON.stringify(data, null, 2);
            jobDataSection.style.display = 'block';
          } else {
            jobDataSection.style.display = 'none';
          }
        })
        .catch(error => {
          console.error('Error loading job data:', error);
          jobDataSection.style.display = 'none';
        });
    }
    
    // Update refresh status
    function updateRefreshStatus() {
      refreshStatus.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    }
    
    // Update job details if the selected job is updated
    function updateJobDetails() {
      if (selectedJobId) {
        const activeJob = activeJobs.find(job => job.id === selectedJobId);
        const completedJob = completedJobs.find(job => job.id === selectedJobId);
        
        if (activeJob || completedJob) {
          selectJob(selectedJobId);
        }
      }
    }
    
    // Auto-refresh jobs every 30 seconds
    setInterval(loadJobs, 30000);
    
    // Initial load
    loadJobs();
  </script>
</body>
</html>
`;

fs.writeFileSync(indexPath, dashboardHtml);

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

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Join a room for a specific job
  socket.on('join', (jobId) => {
    if (typeof jobId === 'string') {
      socket.join(jobId);
      console.log(`Socket ${socket.id} joined room for job ${jobId}`);
      
      // Send initial logs for this job if it exists
      const activeJob = activeJobs.find(job => job.id === jobId);
      const completedJob = completedJobs.find(job => job.id === jobId);
      
      if (activeJob || completedJob) {
        const job = activeJob || completedJob;
        socket.emit('job-log', {
          jobId: job.id,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Viewing job details for: ${job.name} (${job.id})`
        });
        
        if (job.progress > 0) {
          socket.emit('job-log', {
            jobId: job.id,
            timestamp: new Date().toISOString(),
            level: 'info',
            message: `Current progress: ${job.progress}%`
          });
        }
      }
    } else {
      console.error(`Invalid job ID for room joining: ${JSON.stringify(jobId)}`);
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

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
      
      // Emit job update to all clients
      io.emit('job-updated', job);
      
      // Emit log message to job room
      io.to(job.id).emit('job-log', {
        jobId: job.id,
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Processing data: ' + progress + '% complete'
      });
      
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
        
        io.to(job.id).emit('job-log', {
          jobId: job.id,
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Saved initial data to storage'
        });
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
      
      console.log(`Job ${job.id} completed after ${durationSec} seconds`);
      
      // Move job from active to completed
      activeJobs = activeJobs.filter(j => j.id !== job.id);
      completedJobs.unshift(job);
      
      // Save completed jobs to file
      fs.writeFileSync(jobsDataPath, JSON.stringify({
        jobs: completedJobs
      }, null, 2));
      
      // Emit job completed to all clients
      io.emit('job-completed', job);
      
      // Emit log message to job room
      io.to(job.id).emit('job-log', {
        jobId: job.id,
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Job completed successfully'
      });
    }
  }, 3000);
} 