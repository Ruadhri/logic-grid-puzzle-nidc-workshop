const { Router } = require('express');
const puzzleController = require('../controllers/puzzle');

function setupPuzzleRoutes(app) {
  const router = Router();

  // Puzzle Management
  router.get('/puzzles', puzzleController.listAvailablePuzzles);
  router.post('/puzzles', puzzleController.createPuzzle);
  router.get('/puzzles/:id', puzzleController.getPuzzle);
  
  // Puzzle State Management
  router.post('/puzzles/:id/state', puzzleController.createState);
  router.get('/puzzles/:id/state', puzzleController.getState);
  router.post('/puzzles/:id/state/marking', puzzleController.applyMarking);
  router.post('/puzzles/:id/state/undo', puzzleController.undoMarking);
  router.get('/puzzles/:id/state/validate', puzzleController.validateState);

  // Mount routes
  app.use('/api', router);
}

module.exports = {
  setupPuzzleRoutes
};