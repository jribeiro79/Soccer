import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Container, List, ListItem, ListItemText, Card, CardContent, Grid, Box } from '@mui/material';
import GamesList from '../components/GamesList';
import TeamCumulativeStatsTable from '../components/TeamCumulativeStatsTable';

function TeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/teams/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setTeam(data))
      .catch((error) => console.error('Error fetching team:', error));

    fetch(`${API_URL}/games/team/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setGames(Array.isArray(data) ? data : []))  // Garantir que games é sempre um array
      .catch((error) => console.error('Error fetching games:', error));
  }, [teamId]);

  const handleCreateGame = () => {
    navigate(`/team/${teamId}/create-game`);
  };

  const handleAddPlayer = () => {
    navigate(`/team/${teamId}/add-player`);
  };

  const filteredPlayers = team && team.players
    ? team.players.filter((player) =>
        (filter === 'all' || player.position === filter) &&
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const sortedPlayers = filteredPlayers.sort((a, b) => a.name.localeCompare(b.name));

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        {team.name}
      </Typography>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white', padding: 2, display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
          Retroceder
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateGame}>
          Criar Jogo
        </Button>
        <Button variant="contained" color="primary" onClick={handleAddPlayer}>
          Adicionar Jogador
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Jogadores
              </Typography>
              <List>
                {sortedPlayers.map((player) => (
                  <ListItem key={player.id} component={Link} to={`/team/${teamId}/player/${player.id}`}>
                    <ListItemText primary={player.name} sx={{ color: '#1976d2', textDecoration: 'underline' }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Jogos
              </Typography>
              <GamesList games={games} teamId={teamId} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Estatísticas Acumuladas
              </Typography>
              <TeamCumulativeStatsTable teamId={teamId} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default TeamPage;