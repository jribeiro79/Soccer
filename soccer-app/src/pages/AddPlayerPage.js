import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

function AddPlayerPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

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
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
        navigate(`/team/${teamId}`);
      }, 1000);
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
          Gravar
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/team/${teamId}`)} sx={{ mt: 2, ml: 2 }}>
          Retroceder
        </Button>
        {addSuccess && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            Jogador adicionado com sucesso!
          </Typography>
        )}
      </form>
    </Container>
  );
}

export default AddPlayerPage;