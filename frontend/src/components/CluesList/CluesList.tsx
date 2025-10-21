import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

interface Clue {
  type: string;
  description: string;
}

interface CluesListProps {
  clues: Clue[];
}

export const CluesList = ({ clues }: CluesListProps): React.ReactElement => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Clues
      </Typography>
      <List>
        {clues.map((clue, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${index + 1}. ${clue.description}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};