import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';

function GameForm({ teamId, onGameCreated }) {
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const game = { teamId, opponent, date };

    await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(game)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao criar jogo.');
      }
      return response.json();
    })
    .then(onGameCreated)
    .catch(error => console.error('Erro ao criar jogo:', error));
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Equipe Adversária"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data do Jogo"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" type="submit">
          Criar Jogo
        </Button>
      </form>
    </Container>
  );
}

export default GameForm;