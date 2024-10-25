import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

function AddPlayerPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
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
    .then(() => {
      // Redirecionar de volta para a página de detalhes da equipa
      navigate(`/team/${teamId}`);
    })
    .catch(error => console.error('Erro ao adicionar jogador:', error));
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Adicionar Jogador
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome do Jogador"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Adicionar Jogador
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ mt: 2, ml: 2 }}>
          Retroceder
        </Button>
      </form>
    </Container>
  );
}

export default AddPlayerPage;