import axios from 'axios';
import { Puzzle, PuzzleState, PuzzleListItem } from '../types/puzzle';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const puzzleApi = {
  // Puzzle Management
  listPuzzles: async (): Promise<PuzzleListItem[]> => {
    const response = await axios.get(`${API_BASE_URL}/puzzles`);
    return response.data;
  },

  createPuzzle: async (puzzle: Puzzle): Promise<{ id: string }> => {
    const response = await axios.post(`${API_BASE_URL}/puzzles`, puzzle);
    return response.data;
  },

  getPuzzle: async (id: string): Promise<Puzzle> => {
    const response = await axios.get(`${API_BASE_URL}/puzzles/${id}`);
    return response.data;
  },

  // State Management
  createState: async (puzzleId: string): Promise<PuzzleState> => {
    const response = await axios.post(`${API_BASE_URL}/puzzles/${puzzleId}/state`);
    return response.data;
  },

  getState: async (puzzleId: string): Promise<PuzzleState> => {
    const response = await axios.get(`${API_BASE_URL}/puzzles/${puzzleId}/state`);
    return response.data;
  },

  applyMarking: async (puzzleId: string, marking: {
    categoryA: string;
    optionA: string;
    categoryB: string;
    optionB: string;
    state: 'confirmed' | 'eliminated';
  }): Promise<PuzzleState> => {
    const response = await axios.post(
      `${API_BASE_URL}/puzzles/${puzzleId}/state/marking`,
      marking
    );
    return response.data;
  },

  undoMarking: async (puzzleId: string): Promise<PuzzleState> => {
    const response = await axios.post(`${API_BASE_URL}/puzzles/${puzzleId}/state/undo`);
    return response.data;
  },

  validateState: async (puzzleId: string): Promise<{
    hasConflicts: boolean;
    conflicts: Array<any>;
    hasRequiredValues: boolean;
  }> => {
    const response = await axios.get(`${API_BASE_URL}/puzzles/${puzzleId}/state/validate`);
    return response.data;
  }
};