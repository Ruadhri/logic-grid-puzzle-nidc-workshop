const { loadPuzzle, applyMarking, validate, undo } = require('../../engine/engine');

// In-memory storage for MVP
const puzzles = new Map();
const puzzleStates = new Map();

function createPuzzle(req, res) {
  const puzzle = req.body;
  
  try {
    // Validate puzzle structure
    if (!puzzle.id || !puzzle.categories || puzzle.categories.length < 2) {
      return res.status(400).json({
        error: 'Invalid puzzle structure',
        message: 'Puzzle must have an ID and at least 2 categories'
      });
    }

    // Store puzzle
    puzzles.set(puzzle.id, puzzle);
    
    res.status(201).json({
      id: puzzle.id,
      message: 'Puzzle created successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create puzzle',
      message: error.message
    });
  }
}

function getPuzzle(req, res) {
  const { id } = req.params;
  
  const puzzle = puzzles.get(id);
  if (!puzzle) {
    return res.status(404).json({
      error: 'Puzzle not found',
      message: `No puzzle found with ID: ${id}`
    });
  }

  res.json(puzzle);
}

function createState(req, res) {
  const { id } = req.params;
  
  const puzzle = puzzles.get(id);
  if (!puzzle) {
    return res.status(404).json({
      error: 'Puzzle not found',
      message: `No puzzle found with ID: ${id}`
    });
  }

  try {
    const state = loadPuzzle(puzzle);
    puzzleStates.set(id, state);

    res.status(201).json(state);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create puzzle state',
      message: error.message
    });
  }
}

function getState(req, res) {
  const { id } = req.params;
  
  const state = puzzleStates.get(id);
  if (!state) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  res.json(state);
}

function applyMarkingToState(req, res) {
  const { id } = req.params;
  const marking = req.body;
  
  const state = puzzleStates.get(id);
  if (!state) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  try {
    const newState = applyMarking(state, marking);
    puzzleStates.set(id, newState);

    res.json(newState);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to apply marking',
      message: error.message
    });
  }
}

function undoMarking(req, res) {
  const { id } = req.params;
  
  const state = puzzleStates.get(id);
  if (!state) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  try {
    const newState = undo(state);
    puzzleStates.set(id, newState);

    res.json(newState);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to undo marking',
      message: error.message
    });
  }
}

function validateState(req, res) {
  const { id } = req.params;
  
  const state = puzzleStates.get(id);
  if (!state) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  try {
    const validation = validate(state);
    res.json(validation);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to validate state',
      message: error.message
    });
  }
}

module.exports = {
  createPuzzle,
  getPuzzle,
  createState,
  getState,
  applyMarking: applyMarkingToState,
  undoMarking,
  validateState
};