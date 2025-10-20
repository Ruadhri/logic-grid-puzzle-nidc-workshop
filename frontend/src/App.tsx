import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { LogicGrid } from './components/LogicGrid/LogicGrid';
import { puzzleApi } from './services/puzzleApi';
import { Cell, PuzzleState } from './types/puzzle';
import { useQuery, useMutation, useQueryClient } from 'react-query';

function App() {
  const [currentPuzzleId] = useState<string>('test-puzzle'); // For testing
  const queryClient = useQueryClient();

  // Fetch puzzle state
  const { data: puzzleState, isLoading, error } = useQuery<PuzzleState>(
    ['puzzleState', currentPuzzleId],
    () => puzzleApi.getState(currentPuzzleId),
    {
      onError: () => {
        // If state doesn't exist, create it
        createInitialState();
      }
    }
  );

  // Mutations
  const applyMarkingMutation = useMutation(
    (marking: { cell: Cell; newState: 'confirmed' | 'eliminated' }) =>
      puzzleApi.applyMarking(currentPuzzleId, {
        ...marking.cell,
        state: marking.newState
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['puzzleState', currentPuzzleId]);
      }
    }
  );

  const undoMutation = useMutation(
    () => puzzleApi.undoMarking(currentPuzzleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['puzzleState', currentPuzzleId]);
      }
    }
  );

  const createInitialState = async () => {
    try {
      await puzzleApi.createState(currentPuzzleId);
      queryClient.invalidateQueries(['puzzleState', currentPuzzleId]);
    } catch (error) {
      console.error('Failed to create initial state:', error);
    }
  };

  const handleCellClick = (cell: Cell) => {
    // Cycle through states: unknown -> confirmed -> eliminated -> unknown
    const nextState = cell.state === 'unknown' ? 'confirmed' :
                     cell.state === 'confirmed' ? 'eliminated' : 'unknown';
    
    if (nextState === 'unknown') {
      // Use undo instead of setting to unknown
      undoMutation.mutate();
    } else {
      applyMarkingMutation.mutate({ cell, newState: nextState as 'confirmed' | 'eliminated' });
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading puzzle</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Logic Grid Puzzle
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => undoMutation.mutate()}
            disabled={!puzzleState?.history.length}
          >
            Undo
          </Button>
        </Paper>

        {puzzleState && (
          <LogicGrid 
            cells={puzzleState.cells} 
            onCellClick={handleCellClick} 
          />
        )}
      </Box>
    </Container>
  );
}

export default App;
