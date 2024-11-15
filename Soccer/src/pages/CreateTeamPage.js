import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

function CreateTeamPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    const team = { name };

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
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        navigate('/');
      }, 1000);  // Redirecionar após 1 segundo
    })
    .catch(error => console.error('Erro ao criar equipa:', error));
  };

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Criar Equipa
      </Typography>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white', padding: 2, display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Retroceder
        </Button>
        <Button variant="contained" color="primary" type="submit" form="create-team-form">
          Gravar
        </Button>
      </Box>
      <form id="create-team-form" onSubmit={handleSubmit}>
        <TextField
          label="Nome da Equipa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        {createSuccess && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            Equipa criada com sucesso!
          </Typography>
        )}
      </form>
    </Container>
  );
}

export default CreateTeamPage;