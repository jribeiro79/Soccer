import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Container, List, ListItem, ListItemText, Card, CardContent, Box } from '@mui/material';
import GamesList from '../components/GamesList'; // Importa o componente GamesList
import TeamCumulativeStatsTable from '../components/TeamCumulativeStatsTable'; // Importa o componente TeamCumulativeStatsTable

function TeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch the team information
    fetch(`https://localhost:44314/api/teams/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => setTeam(data))
    .catch(error => console.error('Error fetching team:', error));

    // Fetch the games for the team
    fetch(`https://localhost:44314/api/games/team/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => setGames(data))
    .catch(error => console.error('Error fetching games:', error));
  }, [teamId]);

  const handleCreateGame = () => {
    navigate(`/team/${teamId}/create-game`);
  };

  const handleAddPlayer = () => {
    navigate(`/team/${teamId}/add-player`);
  };

  const filteredPlayers = team ? team.players.filter(player => {
    return (filter === 'all' || player.position === filter) &&
           player.name.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        {team.name}
      </Typography>
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
        Retroceder
      </Button>
      <Button variant="contained" color="primary" onClick={handleCreateGame} sx={{ mr: 2 }}>
        Criar Jogo
      </Button>
      <Button variant="contained" color="primary" onClick={handleAddPlayer}>
        Adicionar Jogador
      </Button>
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Card sx={{ flex: 1, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Jogadores
            </Typography>
            <List>
              {filteredPlayers.map(player => (
                <ListItem key={player.id} component={Link} to={`/player/${player.id}`}>
                  <ListItemText primary={player.name} sx={{ color: '#1976d2', textDecoration: 'underline' }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Jogos
            </Typography>
            <GamesList games={games} teamId={teamId} />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, border: '1px solid #333' }}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
              Estatísticas Acumuladas
            </Typography>
            <TeamCumulativeStatsTable teamId={teamId} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default TeamPage;