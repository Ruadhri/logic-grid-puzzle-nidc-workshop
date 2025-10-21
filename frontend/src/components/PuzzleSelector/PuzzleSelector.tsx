import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { puzzleApi } from '../../services/puzzleApi';
import { PuzzleListItem } from '../../types/puzzle';

interface PuzzleSelectorProps {
  selectedPuzzleId: string;
  onPuzzleSelected: (id: string) => void;
}

export const PuzzleSelector = ({
  selectedPuzzleId,
  onPuzzleSelected,
}: PuzzleSelectorProps): React.ReactElement => {
  const { data: puzzles, isLoading } = useQuery<PuzzleListItem[]>(
    'puzzles',
    puzzleApi.listPuzzles
  );

  return (
    <FormControl fullWidth>
      <InputLabel id="puzzle-select-label">Select Puzzle</InputLabel>
      <Select
        labelId="puzzle-select-label"
        value={selectedPuzzleId}
        label="Select Puzzle"
        onChange={(e) => onPuzzleSelected(e.target.value)}
        disabled={isLoading}
      >
        {puzzles?.map((puzzle) => (
          <MenuItem key={puzzle.id} value={puzzle.id}>
            {puzzle.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};