import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

function GameForm({ teamId, onGameCreated }) {
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false); // Estado para o feedback de sucesso

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
      setCreateSuccess(true);  // Definir sucesso no feedback
      setTimeout(() => {
        setCreateSuccess(false);
        onGameCreated();
      }, 1000);  // Redirecionar após 1 segundo
    })
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
        {createSuccess && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            Jogo criado com sucesso!
          </Typography>
        )}
      </form>
    </Container>
  );
}

export default GameForm;