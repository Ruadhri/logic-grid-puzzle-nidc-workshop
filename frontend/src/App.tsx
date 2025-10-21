import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { CluesList } from './components/CluesList/CluesList';
import { LogicGrid } from './components/LogicGrid/LogicGrid';
import { PuzzleSelector } from './components/PuzzleSelector/PuzzleSelector';
import { puzzleApi } from './services/puzzleApi';
import { Cell, PuzzleState, PuzzleListItem } from './types/puzzle';
import { useQuery, useMutation, useQueryClient } from 'react-query';

function App() {
  const [currentPuzzleId, setCurrentPuzzleId] = useState<string>('');
  const queryClient = useQueryClient();
  
  // Fetch available puzzles
  const { data: puzzles, isLoading: isLoadingPuzzles } = useQuery<PuzzleListItem[]>(
    'puzzles',
    puzzleApi.listPuzzles,
    {
      onSuccess: (data) => {
        // Set sample1 puzzle as default if none selected
        if (!currentPuzzleId && data && data.length > 0) {
          const samplePuzzle = data.find(p => p.id === 'sample1');
          if (samplePuzzle) {
            setCurrentPuzzleId(samplePuzzle.id);
          } else {
            setCurrentPuzzleId(data[0].id);
          }
        }
      }
    }
  );

  // Fetch puzzle state
  const { data: puzzleState, isLoading: isLoadingState, error } = useQuery<PuzzleState>(
    ['puzzleState', currentPuzzleId],
    async () => {
      if (!currentPuzzleId) {
        throw new Error('No puzzle selected');
      }
      try {
        return await puzzleApi.getState(currentPuzzleId);
      } catch (err) {
        // If state doesn't exist, create it
        console.log('Creating initial state for puzzle:', currentPuzzleId);
        return await puzzleApi.createState(currentPuzzleId);
      }
    },
    {
      retry: false, // Don't retry on error for debugging
      enabled: !!currentPuzzleId // Only run query if we have a puzzle ID
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

  if (isLoadingPuzzles) {
    return <Typography>Loading puzzles...</Typography>;
  }

  if (!puzzles?.length) {
    return <Typography>No puzzles available</Typography>;
  }

  if (currentPuzzleId && isLoadingState) {
    return <Typography>Loading puzzle state...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading puzzle state</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Logic Grid Puzzle
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <PuzzleSelector 
                selectedPuzzleId={currentPuzzleId}
                onPuzzleSelected={(id) => {
                  setCurrentPuzzleId(id);
                  queryClient.invalidateQueries(['puzzleState', id]);
                }}
              />
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => undoMutation.mutate()}
              disabled={!puzzleState?.history.length}
            >
              Undo
            </Button>
          </Box>
        </Paper>

        {puzzleState && (
          <>
            {puzzleState.clues && (
              <CluesList clues={puzzleState.clues} />
            )}
            <LogicGrid 
              cells={puzzleState.cells} 
              onCellClick={handleCellClick} 
            />
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
