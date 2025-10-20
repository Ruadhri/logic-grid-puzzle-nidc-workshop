import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Cell } from '../../types/puzzle';

interface LogicGridProps {
  cells: Cell[];
  onCellClick: (cell: Cell) => void;
}

export const LogicGrid: React.FC<LogicGridProps> = ({ cells, onCellClick }) => {
  // Get unique values
  const people = Array.from(new Set(cells.map(cell => cell.optionA)));
  const drinks = Array.from(new Set(cells.map(cell => cell.optionB)));

  // Group cells by person (rows) and drinks (columns)
  const cellsByPosition = people.map(person => 
    drinks.map(drink => 
      cells.find(cell => 
        cell.optionA === person && cell.optionB === drink
      )
    )
  );

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header row with drink options */}
        <Box sx={{ display: 'flex', ml: 8 }}>
          {drinks.map(drink => (
            <Typography key={drink} sx={{ width: 80, textAlign: 'center' }}>
              {drink}
            </Typography>
          ))}
        </Box>

        {/* Grid rows */}
        {cellsByPosition.map((row, rowIndex) => (
          <Box key={people[rowIndex]} sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Row label (person) */}
            <Typography sx={{ width: 60, mr: 2 }}>
              {people[rowIndex]}
            </Typography>

            {/* Cells in the row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {row.map((cell, colIndex) => cell && (
                <Paper 
                  key={`${cell.categoryA}-${cell.optionA}-${cell.categoryB}-${cell.optionB}`}
                  elevation={2}
                  sx={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    backgroundColor: cell.state === 'confirmed' ? '#4caf50' :
                                   cell.state === 'eliminated' ? '#f44336' : '#fff',
                    '&:hover': {
                      opacity: 0.8,
                      elevation: 4
                    }
                  }}
                  onClick={() => onCellClick(cell)}
                >
                  {cell.state === 'confirmed' ? '✓' :
                   cell.state === 'eliminated' ? '×' : ''}
                </Paper>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};