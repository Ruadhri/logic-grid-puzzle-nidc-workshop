export interface Cell {
  categoryA: string;      // Category ID
  categoryAName: string;  // Category display name
  optionA: string;       // Option ID
  optionALabel: string;  // Option display name
  categoryB: string;      // Category ID
  categoryBName: string;  // Category display name
  optionB: string;       // Option ID
  optionBLabel: string;  // Option display name
  state: 'unknown' | 'confirmed' | 'eliminated';
}

export interface Puzzle {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  categories: {
    id: string;
    name: string;
    options: {
      id: string;
      label: string;
    }[];
  }[];
  clues: {
    type: string;
    description: string;
  }[];
}

export interface PuzzleListItem {
  id: string;
  title: string;
  author: string;
  createdAt: string;
}

export interface PuzzleState {
  puzzleId: string;
  title: string;
  cells: Cell[];
  clues: {
    type: string;
    description: string;
  }[];
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