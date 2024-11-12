import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

function CreateGamePage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [opponentName, setOpponentName] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    const game = { teamId, opponentName, gameDate: new Date(gameDate).toISOString() };

    fetch(`${API_URL}/games`, {
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
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        navigate(`/team/${teamId}`);
      }, 1000);
    })
    .catch(error => console.error('Erro ao criar jogo:', error));
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Criar Jogo
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Adversário"
          value={opponentName}
          onChange={(e) => setOpponentName(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data do Jogo"
          type="datetime-local"
          value={gameDate}
          onChange={(e) => setGameDate(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Gravar
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/team/${teamId}`)} sx={{ mt: 2, ml: 2 }}>
          Retroceder
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

export default CreateGamePage;