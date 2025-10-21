const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const puzzleController = require('./api/controllers/puzzle');
const { setupPuzzleRoutes } = require('./api/routes/puzzle');

const app = express();
const port = process.env.PORT || 3001;

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Load puzzles on startup
const puzzlesDir = path.join(__dirname, '..', 'data', 'puzzles');
console.log('Starting server...');
console.log('Looking for puzzles in:', puzzlesDir);

// Function to load a puzzle file
const loadPuzzleFile = (filePath) => {
  try {
    const puzzleData = fs.readFileSync(filePath, 'utf8');
    console.log(`Read puzzle data from ${filePath}`);
    const puzzle = JSON.parse(puzzleData);
    console.log('Parsed puzzle:', puzzle.id);
    console.log('Storing puzzle...');
    puzzleController.storePuzzle(puzzle);
    return true;
  } catch (error) {
    console.error(`Failed to load puzzle from ${filePath}:`, error);
    return false;
  }
};

// Load all puzzle files from the puzzles directory
try {
  const puzzleFiles = fs.readdirSync(puzzlesDir);
  console.log('Found puzzle files:', puzzleFiles);
  
  let loadedCount = 0;
  for (const file of puzzleFiles) {
    if (file.endsWith('.json')) {
      const filePath = path.join(puzzlesDir, file);
      if (loadPuzzleFile(filePath)) {
        loadedCount++;
      }
    }
  }
  
  console.log(`Successfully loaded ${loadedCount} puzzles`);
} catch (error) {
  console.error('Failed to read puzzles directory:', error);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
setupPuzzleRoutes(app);

// Expose resetPuzzleState for testing
app.locals.resetPuzzleState = () => {
  puzzleController.resetState();
};

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Logic Grid Puzzle server running on port ${port}`);
  });
}

module.exports = app; // Export for testing