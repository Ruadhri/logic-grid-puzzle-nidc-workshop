/**
 * Logic Grid Puzzle Engine
 * Core module for puzzle state management and constraint propagation
 */

/**
 * Initialize puzzle state
 * @param {Object} puzzle Puzzle definition
 * @returns {Object} Initial state
 */
function loadPuzzle(puzzle) {
  if (!puzzle.categories || puzzle.categories.length < 2) {
    throw new Error('Invalid puzzle structure');
  }

  // Generate all possible cell combinations between each pair of categories
  const cells = [];
  
  // For each pair of categories, create cells
  for (let i = 0; i < puzzle.categories.length; i++) {
    for (let j = i + 1; j < puzzle.categories.length; j++) {
      const cat1 = puzzle.categories[i];
      const cat2 = puzzle.categories[j];
      
      // Create cells for this category pair
      for (const opt1 of cat1.options) {
        for (const opt2 of cat2.options) {
          const option1 = typeof opt1 === 'object' ? opt1 : { id: opt1, label: opt1 };
          const option2 = typeof opt2 === 'object' ? opt2 : { id: opt2, label: opt2 };
          
          cells.push({
            categoryA: cat1.name,
            optionA: option1.id,
            optionALabel: option1.label,
            categoryAName: cat1.name,
            categoryB: cat2.name,
            optionB: option2.id,
            optionBLabel: option2.label,
            categoryBName: cat2.name,
            state: 'unknown'
          });
        }
      }
    }
  }

  return {
    puzzleId: puzzle.id,
    cells,
    history: []
  };
}

/**
 * Apply a marking and propagate constraints
 * @param {Object} state Current puzzle state
 * @param {Object} marking Cell marking to apply
 * @returns {Object} New state after marking and propagation
 */
function applyMarking(state, marking) {
  // Store previous state for undo
  const previousState = {
    cells: state.cells.map(cell => ({ ...cell })),
    history: [...state.history]
  };

  // Create new state
  const newState = {
    ...state,
    cells: state.cells.map(cell => ({ ...cell }))
  };

  // Apply direct marking
  const targetCell = newState.cells.find(c =>
    c.categoryA === marking.categoryA &&
    c.optionA === marking.optionA &&
    c.categoryB === marking.categoryB &&
    c.optionB === marking.optionB
  );
  
  if (targetCell) {
    targetCell.state = marking.state;
  }

  // Propagate constraints and store the action
  const propagatedState = propagate(newState);
  propagatedState.history = [...state.history, { previousState, marking }];
  
  return propagatedState;
}

/**
 * Propagate constraints through the grid
 * @param {Object} state Current puzzle state
 * @returns {Object} New state after propagation
 */
function propagate(state) {
  const newState = { ...state, cells: state.cells.map(cell => ({ ...cell })) };

  // Find all confirmed cells
  const confirmedCells = newState.cells.filter(c => c.state === 'confirmed');

  // For each confirmed cell, eliminate conflicting options
  for (const cell of confirmedCells) {
    // Don't eliminate other confirmed cells to allow validation to catch conflicts
    const unconfirmedCells = newState.cells.filter(c => 
      c !== cell && c.state !== 'confirmed'
    );

    // Eliminate cells in same row/column
    unconfirmedCells
      .filter(c => 
        // Same row (person-option) eliminates other drink options
        (c.categoryA === cell.categoryA && c.optionA === cell.optionA) ||
        // Same column (drink-option) eliminates other person options
        (c.categoryB === cell.categoryB && c.optionB === cell.optionB)
      )
      .forEach(c => { c.state = 'eliminated'; });
  }

  return newState;
}

/**
 * Validate current state for conflicts
 * @param {Object} state Current puzzle state
 * @returns {Object} Validation result
 */
function validate(state) {
  const confirmedCells = state.cells.filter(c => c.state === 'confirmed');
  
  // Check for conflicts between confirmed cells
  const conflicts = [];
  confirmedCells.forEach((cell, i) => {
    confirmedCells.slice(i + 1).forEach(otherCell => {
      if (
        (cell.categoryA === otherCell.categoryA && cell.optionA === otherCell.optionA) ||
        (cell.categoryB === otherCell.categoryB && cell.optionB === otherCell.optionB)
      ) {
        conflicts.push([cell, otherCell]);
      }
    });
  });
  const hasConflicts = conflicts.length > 0;

  // Get categories and their options from cells
  const categories = Array.from(new Set(state.cells.map(cell => cell.categoryA)));
  const getOptionsForCategory = (category) => 
    Array.from(new Set(state.cells
      .filter(cell => cell.categoryA === category || cell.categoryB === category)
      .map(cell => cell.categoryA === category ? cell.optionA : cell.optionB)
    ));

  // Check if each category-option combination has at least one possible cell
  const hasRequiredValues = categories.every(category => {
    const options = getOptionsForCategory(category);
    return options.every(option => {
      return state.cells.some(cell => 
        ((cell.categoryA === category && cell.optionA === option) ||
         (cell.categoryB === category && cell.optionB === option)) &&
        cell.state !== 'eliminated'
      );
    });
  });

  return {
    hasConflicts,
    conflicts,
    hasRequiredValues
  };
}

/**
 * Undo last marking and propagation
 * @param {Object} state Current puzzle state
 * @returns {Object} Previous state
 */
function undo(state) {
  if (state.history.length === 0) {
    return state;
  }

  const lastAction = state.history[state.history.length - 1];
  return {
    ...state,
    cells: lastAction.previousState.cells.map(cell => ({ ...cell })),
    history: lastAction.previousState.history
  };
}

module.exports = {
  loadPuzzle,
  applyMarking,
  propagate,
  validate,
  undo
};