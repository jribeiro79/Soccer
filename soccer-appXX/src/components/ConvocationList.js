import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Card, CardContent } from '@mui/material';

function ConvocationList({ convocation, players, gameId, teamId }) {
  // Ordenar jogadores convocados por nome
  const sortedConvocation = [...convocation].sort((a, b) => (players[a] || '').localeCompare(players[b] || ''));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Jogadores Convocados
        </Typography>
        {sortedConvocation.length > 0 ? (
          <List>
            {sortedConvocation.map((playerId) => (
              <ListItem key={playerId} button component={Link} to={`/team/${teamId}/game/${gameId}/player/${playerId}`}>
                <ListItemText primary={players[playerId] || playerId} sx={{ color: '#1976d2', textDecoration: 'underline' }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Nenhum jogador convocado.</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ConvocationList;