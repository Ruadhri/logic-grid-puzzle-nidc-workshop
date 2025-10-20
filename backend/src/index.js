const express = require('express');
const cors = require('cors');
const { setupPuzzleRoutes } = require('./api/routes/puzzle');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
setupPuzzleRoutes(app);

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