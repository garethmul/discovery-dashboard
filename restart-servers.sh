#!/bin/bash

# Kill any processes on the required ports
echo "Killing processes on ports 5176 and 3009..."
lsof -ti:5176,3009 | xargs kill -9 2>/dev/null || true

# Kill any running node processes (in case servers are running in the background)
echo "Killing any running node processes..."
pkill -f "node server-simple.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 2

# Start both servers using concurrently
echo "Starting servers..."
npm run dev &
SERVERS_PID=$!

# Wait for servers to start
sleep 5

# Check if servers are running
echo "Checking server status..."

# Check backend
if curl -s http://localhost:3009/health-check > /dev/null; then
    echo "Backend server is running on port 3009"
else
    echo "Error: Backend server failed to start"
    exit 1
fi

# Check frontend
if curl -s http://localhost:5176 > /dev/null; then
    echo "Frontend server is running on port 5176"
else
    echo "Error: Frontend server failed to start"
    exit 1
fi

echo "Servers restarted successfully!" 