const { loadPuzzle, applyMarking, validate, undo } = require('../../engine/engine');
const store = require('../../store');

// Helper to list all puzzles
const listPuzzles = () => {
  const puzzles = [...store.puzzles.values()].map(puzzle => ({
    id: puzzle.id,
    title: puzzle.title || puzzle.id,
    author: puzzle.author || 'Anonymous',
    createdAt: puzzle.createdAt || new Date().toISOString()
  }));
  return puzzles;
};

// Helper to access puzzle data
const getPuzzleData = (id) => {
  console.log(`Getting puzzle ${id} from collection with ${store.puzzles.size} puzzles`);
  console.log('Available puzzles:', [...store.puzzles.keys()]);
  return store.puzzles.get(id);
};

// Helper to store puzzle data
const storePuzzle = (puzzle) => {
  console.log(`Storing puzzle ${puzzle.id}`);
  store.puzzles.set(puzzle.id, puzzle);
  console.log(`Now have ${store.puzzles.size} puzzles:`, [...store.puzzles.keys()]);
};

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

    // Store puzzle using our central state management
    storePuzzle(puzzle);
    
    res.status(201).json({
      id: puzzle.id,
      message: 'Puzzle created successfully'
    });
  } catch (error) {
    console.error('Failed to create puzzle:', error);
    res.status(500).json({
      error: 'Failed to create puzzle',
      message: error.message
    });
  }
}

function getPuzzle(req, res) {
  const { id } = req.params;
  
  const puzzle = getPuzzleData(id);
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
  if (!id) {
    return res.status(400).json({
      error: 'Missing puzzle ID',
      message: 'Puzzle ID is required to create a state'
    });
  }
  
  console.log('Creating state for puzzle:', id);
  
  try {    
    const puzzle = getPuzzleData(id);
    if (!puzzle) {
      console.error('Puzzle not found:', id);
      return res.status(404).json({
        error: 'Puzzle not found',
        message: `No puzzle found with ID: ${id}`
      });
    }

    // Check if state already exists
    const existingState = store.puzzleStates.get(id);
    if (existingState) {
      console.log('State already exists for puzzle:', id);
      return res.json(existingState);
    }

    console.log('Found puzzle:', puzzle.id);
    console.log('Categories:', puzzle.categories.map(c => c.name).join(', '));
    
    const newState = loadPuzzle(puzzle);
    console.log('Engine created state with cells:', newState.cells.length);
    
    // Add puzzle metadata to state
    newState.title = puzzle.title;
    newState.clues = puzzle.clues;
    
    store.puzzleStates.set(id, newState);
    console.log('State stored successfully');

    res.status(201).json(newState);
  } catch (error) {
    console.error('Failed to create state:', error.stack);
    res.status(500).json({
      error: 'Failed to create puzzle state',
      message: error.message
    });
  }
}

function getState(req, res) {
  const { id } = req.params;
  console.log('Getting state for puzzle:', id);
  
  const puzzleState = store.puzzleStates.get(id);
  if (!puzzleState) {
    console.log('No state found for puzzle:', id);
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  console.log('Found state with cells:', puzzleState.cells.length);
  res.json(puzzleState);
}

function applyMarkingToState(req, res) {
  const { id } = req.params;
  const marking = req.body;
  
  const puzzleState = store.puzzleStates.get(id);
  if (!puzzleState) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  try {
    const newState = applyMarking(puzzleState, marking);
    store.puzzleStates.set(id, newState);

    res.json(newState);
  } catch (error) {
    console.error('Failed to apply marking:', error);
    res.status(500).json({
      error: 'Failed to apply marking',
      message: error.message
    });
  }
}

function undoMarking(req, res) {
  const { id } = req.params;
  
  const puzzleState = store.puzzleStates.get(id);
  if (!puzzleState) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  try {
    const newState = undo(puzzleState);
    store.puzzleStates.set(id, newState);

    res.json(newState);
  } catch (error) {
    console.error('Failed to undo marking:', error);
    res.status(500).json({
      error: 'Failed to undo marking',
      message: error.message
    });
  }
}

function validateState(req, res) {
  const { id } = req.params;
  
  const puzzleState = store.puzzleStates.get(id);
  if (!puzzleState) {
    return res.status(404).json({
      error: 'Puzzle state not found',
      message: `No state found for puzzle ID: ${id}`
    });
  }

  try {
    const validation = validate(puzzleState);
    res.json(validation);
  } catch (error) {
    console.error('Failed to validate state:', error);
    res.status(500).json({
      error: 'Failed to validate state',
      message: error.message
    });
  }
}

function listAvailablePuzzles(req, res) {
  const puzzles = listPuzzles();
  res.json(puzzles);
}

const resetState = () => {
  store.puzzleStates = new Map();
};

module.exports = {
  createPuzzle,
  getPuzzle,
  createState,
  getState,
  applyMarking: applyMarkingToState,
  undoMarking,
  validateState,
  resetState,
  listAvailablePuzzles,
  // Added for testing
  storePuzzle
};