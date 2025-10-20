export interface Cell {
  categoryA: string;
  optionA: string;
  categoryB: string;
  optionB: string;
  state: 'unknown' | 'confirmed' | 'eliminated';
}

export interface Puzzle {
  id: string;
  categories: {
    id: string;
    name: string;
    options: {
      id: string;
      label: string;
    }[];
  }[];
  clues: any[]; // Will be defined later
}

export interface PuzzleState {
  puzzleId: string;
  cells: Cell[];
  history: {
    previousState: {
      cells: Cell[];
      history: any[];
    };
    marking: {
      categoryA: string;
      optionA: string;
      categoryB: string;
      optionB: string;
      state: 'confirmed' | 'eliminated';
    };
  }[];
}