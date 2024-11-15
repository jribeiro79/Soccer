import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createTeam } from '../api';

function TeamForm({ onTeamAdded }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const team = { name };

    createTeam(team)
      .then(response => {
        setName('');
        onTeamAdded(response.data);
      })
      .catch(error => console.error('Erro ao criar equipa:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nome da equipa"
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" type="submit">
        Criar Equipa
      </Button>
    </form>
  );
}

export default TeamForm;