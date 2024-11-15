import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function GamesList({ games = [], teamId }) {
  // Garantir que games é sempre um array antes de mapear
  const sortedGames = Array.isArray(games) ? games.sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate)) : [];
  
  return (
    <List>
      {sortedGames.map((game) => (
        <ListItem button component={Link} to={`/team/${teamId}/game/${game.id}`} key={game.id}>
          <ListItemText primary={`Vs ${game.opponentName} - ${new Date(game.gameDate).toLocaleString()}`} />
        </ListItem>
      ))}
    </List>
  );
}

export default GamesList;