import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function GamesList({ games, teamId }) {
  return (
    <List>
      {games.map((game) => (
        <ListItem button component={Link} to={`/team/${teamId}/game/${game.id}`} key={game.id}>
          <ListItemText primary={`Vs ${game.opponentName} - ${new Date(game.gameDate).toLocaleString()}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default GamesList;