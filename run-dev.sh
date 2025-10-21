#!/bin/bash

# Ensure correct Node.js version is used
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm use

# Kill any existing processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Kill background processes on script exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# Install dependencies if needed
echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Start backend on port 3001
echo "Starting backend on port 3001..."
cd ../backend
PORT=3001 npm run dev 2>&1 | tee ../logs/backend.log.$$ &

# Wait a moment for backend to start
sleep 2

# Start frontend on port 3000
echo "Starting frontend on port 3000..."
cd ../frontend
PORT=3000 npm start 2>&1 | tee ../logs/frontend.log.$$ &

# Wait for both processes
wait