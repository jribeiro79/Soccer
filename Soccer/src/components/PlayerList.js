import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function PlayerList({ players, gameId }) {
  // Ordenar jogadores por nome
  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <List>
      {sortedPlayers.map((player) => (
        <ListItem button component={Link} to={`/game/${gameId}/player/${player.id}`} key={player.id}>
          <ListItemText primary={player.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default PlayerList;