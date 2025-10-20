import React from 'react';
import { Paper, Grid } from '@mui/material';
import { Cell } from '../../types/puzzle';

interface LogicGridProps {
  cells: Cell[];
  onCellClick: (cell: Cell) => void;
}

export const LogicGrid: React.FC<LogicGridProps> = ({ cells, onCellClick }) => {
  // Group cells by categoryA (rows)
  const cellsByCategory = cells.reduce((acc, cell) => {
    if (!acc[cell.categoryA]) {
      acc[cell.categoryA] = [];
    }
    acc[cell.categoryA].push(cell);
    return acc;
  }, {} as Record<string, Cell[]>);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {Object.entries(cellsByCategory).map(([category, categoryCells]) => (
          <Grid container item key={category} spacing={1}>
            {categoryCells.map((cell) => (
              <Grid item key={`${cell.categoryA}-${cell.optionA}-${cell.categoryB}-${cell.optionB}`}>
                <Paper 
                  elevation={1}
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: cell.state === 'confirmed' ? '#4caf50' :
                                   cell.state === 'eliminated' ? '#f44336' : '#fff'
                  }}
                  onClick={() => onCellClick(cell)}
                >
                  {cell.state === 'confirmed' ? '✓' :
                   cell.state === 'eliminated' ? '×' : ''}
                </Paper>
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};