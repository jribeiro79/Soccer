import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function PlayerForm({ teamId, onPlayerAdded }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const player = { name };

    fetch(`https://localhost:44314/api/teams/${teamId}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(player)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao adicionar jogador.');
      }
      return response.json();
    })
    .then(data => {
      setName('');
      onPlayerAdded();
    })
    .catch(error => console.error('Erro ao adicionar jogador:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Nome do jogador"
        value={name}
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" type="submit">
        Adicionar Jogador
      </Button>
    </form>
  );
}

export default PlayerForm;