import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

function PlayerForm({ teamId, onPlayerAdded }) {
  const [name, setName] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false); // Estado para o feedback de sucesso

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    const player = { name };

    fetch(`${API_URL}/teams/${teamId}/players`, {
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
      setCreateSuccess(true);  // Definir sucesso no feedback
      setTimeout(() => {
        setCreateSuccess(false);
        onPlayerAdded();
      }, 1000);  // Redirecionar após 1 segundo
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
      {createSuccess && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          Jogador adicionado com sucesso!
        </Typography>
      )}
    </form>
  );
}

export default PlayerForm;