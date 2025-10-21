import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Cell } from '../../types/puzzle';

interface LogicGridProps {
  cells: Cell[];
  onCellClick: (cell: Cell) => void;
}

export const LogicGrid = ({ cells, onCellClick }: LogicGridProps): React.ReactElement => {
  // Get unique categories and their options
  const categories = Array.from(new Set(cells.map(cell => cell.categoryA)));
  const categoryPairs = categories.flatMap((cat1, i) => 
    categories.slice(i + 1).map(cat2 => [cat1, cat2])
  );

  // Function to get options for a category with their labels
  const getOptionsForCategory = (category: string): { id: string, label: string }[] => {
    // Get all options from cells where this category appears
    return Array.from(new Set(cells
      .filter(cell => cell.categoryA === category || cell.categoryB === category)
      .map(cell => {
        const optId = cell.categoryA === category ? cell.optionA : cell.optionB;
        const optLabel = cell.categoryA === category ? cell.optionALabel : cell.optionBLabel;
        // Ensure both id and label are strings
        return { 
          id: String(optId),
          label: String(optLabel || optId)
        };
      })
      .map(opt => JSON.stringify(opt)) // Convert to string for deduplication
    ))
    .map(opt => JSON.parse(opt)) // Convert back to object
    .sort((a, b) => String(a.label).localeCompare(String(b.label))); // Ensure string comparison
  };

  // Create grid sections for each category pair
  const gridSections = categoryPairs.map(([catA, catB]) => {
    const optionsA = getOptionsForCategory(catA);
    const optionsB = getOptionsForCategory(catB);

    return {
      categoryA: catA,
      categoryAName: cells.find(cell => cell.categoryA === catA)?.categoryAName || catA,
      categoryB: catB,
      categoryBName: cells.find(cell => cell.categoryA === catB)?.categoryAName || catB,
      optionsA,
      optionsB,
      cells: optionsA.map(optA => 
        optionsB.map(optB => 
          cells.find(cell => 
            (cell.categoryA === catA && cell.categoryB === catB && cell.optionA === optA.id && cell.optionB === optB.id) ||
            (cell.categoryA === catB && cell.categoryB === catA && cell.optionA === optB.id && cell.optionB === optA.id)
          )
        )
      )
    };
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {gridSections.map(({ categoryA, categoryAName, categoryB, categoryBName, optionsA, optionsB, cells: sectionCells }) => (
        <Paper key={`${categoryA}-${categoryB}`} elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {categoryAName} vs {categoryBName}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Header row */}
            <Box sx={{ display: 'flex', ml: 12 }}>
              <Box sx={{ width: 120 }} /> {/* Spacer for alignment */}
              {optionsB.map(optB => (
                <Box 
                  key={optB.id}
                  sx={{ 
                    width: 50,
                    minWidth: 50,
                    px: 1,
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {optB.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Grid rows */}
            {sectionCells.map((row, rowIndex) => (
              <Box key={optionsA[rowIndex].id} sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Row label */}
                <Box sx={{ width: 120, pr: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {optionsA[rowIndex].label}
                  </Typography>
                </Box>

                {/* Cells in the row */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {row.map((cell, colIndex) => (
                    <Paper 
                      key={`${optionsA[rowIndex].id}-${optionsB[colIndex].id}`}
                      elevation={1}
                      sx={{
                        width: 50,
                        height: 50,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: cell?.state === 'confirmed' ? '#4caf50' :
                                      cell?.state === 'eliminated' ? '#f44336' : '#fff',
                        '&:hover': {
                          opacity: 0.8,
                          elevation: 3
                        }
                      }}
                      onClick={() => cell && onCellClick(cell)}
                    >
                      {cell?.state === 'confirmed' ? '✓' :
                       cell?.state === 'eliminated' ? '×' : ''}
                    </Paper>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};