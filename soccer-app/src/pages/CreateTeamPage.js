import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container } from '@mui/material';

function CreateTeamPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const team = { name };

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(team)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao criar equipa.');
      }
      return response.json();
    })
    .then(() => {
      // Redirecionar de volta para a página inicial
      navigate('/');
    })
    .catch(error => console.error('Erro ao criar equipa:', error));
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Criar Equipa
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome da Equipa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Criar Equipa
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ mt: 2, ml: 2 }}>
          Retroceder
        </Button>
      </form>
    </Container>
  );
}

export default CreateTeamPage;