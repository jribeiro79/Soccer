import React from 'react';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function TeamList({ teams }) {
  return (
    <List>
      {teams.map((team) => (
        <ListItem button component={Link} to={`/team/${team.id}`} key={team.id}>
          <ListItemText primary={team.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default TeamList;