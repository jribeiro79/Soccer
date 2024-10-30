import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';
import TeamList from '../components/TeamList';

function HomePage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch the teams
    fetch(`${API_URL}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setTeams(data))
    .catch(error => console.error('Erro ao buscar equipas:', error));
  }, []);

  const handleCreateTeam = () => {
    navigate('/create-team');
  };

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Soccer App
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateTeam} sx={{ my: 2 }}>
        Criar Equipa
      </Button>
      <Typography variant="h4" component="h2" gutterBottom>
        Lista de Equipas
      </Typography>
      <TeamList teams={teams} setTeams={setTeams} />
    </Container>
  );
}

export default HomePage;