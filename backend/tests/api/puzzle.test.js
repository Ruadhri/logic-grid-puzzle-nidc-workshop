const request = require('supertest');
const app = require('../../src/index');

describe('Puzzle API', () => {
  const samplePuzzle = {
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

  describe('POST /api/puzzles', () => {
    it('should create a new puzzle', async () => {
      const res = await request(app)
        .post('/api/puzzles')
        .send(samplePuzzle);
      
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(samplePuzzle.id);
    });

    it('should reject invalid puzzle structure', async () => {
      const invalidPuzzle = { ...samplePuzzle, categories: [] };
      
      const res = await request(app)
        .post('/api/puzzles')
        .send(invalidPuzzle);
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/puzzles/:id', () => {
    it('should retrieve an existing puzzle', async () => {
      // Create puzzle first
      await request(app)
        .post('/api/puzzles')
        .send(samplePuzzle);

      const res = await request(app)
        .get(`/api/puzzles/${samplePuzzle.id}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toEqual(samplePuzzle);
    });

    it('should return 404 for non-existent puzzle', async () => {
      const res = await request(app)
        .get('/api/puzzles/non-existent');
      
      expect(res.status).toBe(404);
    });
  });

  describe('Puzzle State Management', () => {
    beforeEach(async () => {
      // Create puzzle
      await request(app)
        .post('/api/puzzles')
        .send(samplePuzzle);
    });

    describe('POST /api/puzzles/:id/state', () => {
      it('should create initial state for puzzle', async () => {
        const res = await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state`);
        
        expect(res.status).toBe(201);
        expect(res.body.puzzleId).toBe(samplePuzzle.id);
        expect(res.body.cells.length).toBe(4); // 2x2 grid
      });
    });

    describe('POST /api/puzzles/:id/state/marking', () => {
      it('should apply marking to puzzle state', async () => {
        // Create state first
        await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state`);

        const marking = {
          categoryA: 'person',
          optionA: 'alice',
          categoryB: 'drink',
          optionB: 'coffee',
          state: 'confirmed'
        };

        const res = await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state/marking`)
          .send(marking);
        
        expect(res.status).toBe(200);
        
        const markedCell = res.body.cells.find(c => 
          c.categoryA === marking.categoryA && 
          c.optionA === marking.optionA &&
          c.categoryB === marking.categoryB &&
          c.optionB === marking.optionB
        );
        expect(markedCell.state).toBe('confirmed');
      });
    });

    describe('POST /api/puzzles/:id/state/undo', () => {
      it('should undo last marking', async () => {
        // Create state
        await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state`);

        // Apply marking
        const marking = {
          categoryA: 'person',
          optionA: 'alice',
          categoryB: 'drink',
          optionB: 'coffee',
          state: 'confirmed'
        };
        await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state/marking`)
          .send(marking);

        // Undo
        const res = await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state/undo`);
        
        expect(res.status).toBe(200);
        expect(res.body.cells.every(c => c.state === 'unknown')).toBe(true);
      });
    });

    describe('GET /api/puzzles/:id/state/validate', () => {
      it('should validate puzzle state', async () => {
        // Create state
        await request(app)
          .post(`/api/puzzles/${samplePuzzle.id}/state`);

        const res = await request(app)
          .get(`/api/puzzles/${samplePuzzle.id}/state/validate`);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('hasConflicts');
        expect(res.body).toHaveProperty('conflicts');
      });
    });
  });
});