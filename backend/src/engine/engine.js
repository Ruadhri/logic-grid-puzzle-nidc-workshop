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

  // Generate all possible cell combinations
  const cells = [];
  const [cat1, cat2] = puzzle.categories;
  // For MVP, we'll work with exactly 2 categories
  for (const opt1 of cat1.options) {
    for (const opt2 of cat2.options) {
      cells.push({
        categoryA: cat1.id,
        optionA: opt1.id,
        categoryB: cat2.id,
        optionB: opt2.id,
        state: 'unknown'
      });
    }
  }

  // Store categories and options in state for validation
  return {
    puzzleId: puzzle.id,
    cells,
    history: [],
    inconsistencyFlags: [],
    categories: puzzle.categories.map(cat => ({ id: cat.id, name: cat.name })),
    options: [
      cat1.options.map(opt => opt.id),
      cat2.options.map(opt => opt.id)
    ]
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

  // Check each category/option combination has at least one possible cell
  // state.options is now [ [opt1, opt2], [opt1, opt2] ]
  const [optionsA, optionsB] = state.options;
  const [catA, catB] = state.categories;
  const categoryACombos = optionsA.map(optA => ({ categoryA: catA.id, optionA: optA }));
  const categoryBCombos = optionsB.map(optB => ({ categoryB: catB.id, optionB: optB }));
  const allCombos = [...categoryACombos, ...categoryBCombos];

  const hasRequiredValues = allCombos.every(combo => {
    const relevantCells = state.cells.filter(cell =>
      ('categoryA' in combo ?
        cell.categoryA === combo.categoryA && cell.optionA === combo.optionA :
        cell.categoryB === combo.categoryB && cell.optionB === combo.optionB)
    );
    return relevantCells.some(cell => cell.state !== 'eliminated');
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