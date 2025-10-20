const { loadPuzzle, applyMarking, propagate, validate, undo } = require('../../src/engine/engine');

describe('Logic Grid Puzzle Engine', () => {
  let samplePuzzle;
  
  beforeEach(() => {
    // Simple 2x2 puzzle for initial tests
    samplePuzzle = {
      id: 'test-puzzle',
      categories: [
        {
          id: 'person',
          name: 'Person',
          options: [
            { id: 'alice', label: 'Alice' },
            { id: 'bob', label: 'Bob' }
          ]
        },
        {
          id: 'drink',
          name: 'Drink',
          options: [
            { id: 'coffee', label: 'Coffee' },
            { id: 'tea', label: 'Tea' }
          ]
        }
      ],
      clues: []
    };
  });

  describe('loadPuzzle', () => {
    it('should initialize an empty state for a valid puzzle', () => {
      const state = loadPuzzle(samplePuzzle);
      expect(state).toEqual({
        puzzleId: 'test-puzzle',
        cells: [
          { categoryA: 'person', optionA: 'alice', categoryB: 'drink', optionB: 'coffee', state: 'unknown' },
          { categoryA: 'person', optionA: 'alice', categoryB: 'drink', optionB: 'tea', state: 'unknown' },
          { categoryA: 'person', optionA: 'bob', categoryB: 'drink', optionB: 'coffee', state: 'unknown' },
          { categoryA: 'person', optionA: 'bob', categoryB: 'drink', optionB: 'tea', state: 'unknown' }
        ],
        history: [],
        inconsistencyFlags: [],
        categories: [
          { id: 'person', name: 'Person' },
          { id: 'drink', name: 'Drink' }
        ],
        options: [
          ['alice', 'bob'],
          ['coffee', 'tea']
        ]
      });
    });

    it('should throw an error for invalid puzzle structure', () => {
      const invalidPuzzle = { ...samplePuzzle, categories: [] };
      expect(() => loadPuzzle(invalidPuzzle)).toThrow('Invalid puzzle structure');
    });
  });

  describe('applyMarking', () => {
    it('should update cell state and trigger propagation', () => {
      const state = loadPuzzle(samplePuzzle);
      const marking = {
        categoryA: 'person',
        optionA: 'alice',
        categoryB: 'drink',
        optionB: 'coffee',
        state: 'confirmed'
      };

      const newState = applyMarking(state, marking);
      
      // Check direct marking applied
      const markedCell = newState.cells.find(c => 
        c.categoryA === marking.categoryA && 
        c.optionA === marking.optionA &&
        c.categoryB === marking.categoryB &&
        c.optionB === marking.optionB
      );
      expect(markedCell.state).toBe('confirmed');

      // Check propagation (other cells in row/column should be eliminated)
      const propagatedCells = newState.cells.filter(c =>
        (c.categoryA === marking.categoryA && c.optionA === marking.optionA && c.optionB !== marking.optionB) ||
        (c.categoryB === marking.categoryB && c.optionB === marking.optionB && c.optionA !== marking.optionA)
      );
      expect(propagatedCells.every(c => c.state === 'eliminated')).toBe(true);
    });
  });

  describe('validate', () => {
    it('should detect conflicts in markings', () => {
      const state = loadPuzzle(samplePuzzle);
      // First confirm Alice drinks Coffee
      const marking1 = {
        categoryA: 'person', optionA: 'alice',
        categoryB: 'drink', optionB: 'coffee',
        state: 'confirmed'
      };
      // Then incorrectly try to confirm Bob drinks Coffee (column conflict)
      const marking2 = {
        categoryA: 'person', optionA: 'bob',
        categoryB: 'drink', optionB: 'coffee',
        state: 'confirmed'
      };

      let newState = applyMarking(state, marking1);
      newState = applyMarking(newState, marking2);

      const validation = validate(newState);
      expect(validation.hasConflicts).toBe(true);
      expect(validation.conflicts.length).toBeGreaterThan(0);
    });
  });

  describe('undo', () => {
    it('should revert the last marking and its propagations', () => {
      const state = loadPuzzle(samplePuzzle);
      const marking = {
        categoryA: 'person', optionA: 'alice',
        categoryB: 'drink', optionB: 'coffee',
        state: 'confirmed'
      };

      const markedState = applyMarking(state, marking);
      const undoneState = undo(markedState);

      // All cells should be back to unknown
      expect(undoneState.cells.every(c => c.state === 'unknown')).toBe(true);
      expect(undoneState.history.length).toBe(0);
    });
  });
});