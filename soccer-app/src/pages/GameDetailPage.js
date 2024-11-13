import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Card, CardContent, Grid } from '@mui/material';
import GameEventsTable from '../components/GameEventsTable';
import ConvocationList from '../components/ConvocationList';
import GameSummary from '../components/GameSummary';

function GameDetailPage() {
  const { teamId, gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState({});
  const [convocation, setConvocation] = useState([]);
  const [result, setResult] = useState({ homeGoals: 0, awayGoals: 0 });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log(`Fetching game details for gameId: ${gameId}`);
    console.log(`Fetching players for teamId: ${teamId}`);
    
    // Fetch game details
    fetch(`${API_URL}/games/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setGame(data);
        setConvocation(data.convocation || []);
      })
      .catch(error => console.error('Error fetching game:', error));

    // Fetch players
    fetch(`${API_URL}/teams/${teamId}/players`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => {
        if (response.status === 404) {
          throw new Error('Team not found');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const playersMap = {};
          data.forEach(player => {
            playersMap[player.id] = player.name;
          });
          setPlayers(playersMap);
        } else {
          console.error('Expected an array of players', data);
        }
      })
      .catch(error => console.error('Error fetching players:', error));

    // Fetch events and calculate result
    fetch(`${API_URL}/events/game/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const homeGoals = data.filter(event => event.type === 'Goal').length;
        const awayGoals = data.filter(event => event.type === 'GoalConceded').length;
        setResult({ homeGoals, awayGoals });
      })
      .catch(error => console.error('Error fetching events:', error));
  }, [teamId, gameId]);

  const sortedConvocation = convocation && Array.isArray(convocation)
    ? convocation.sort((a, b) => (players[a] || '').localeCompare(players[b] || ''))
    : [];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Jogo Contra: {game?.opponentName}
      </Typography>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white', padding: 2, display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/team/${teamId}`)}>
          Retroceder
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate(`/team/${teamId}/game/${gameId}/convocation`)}>
          Gerir Convocação
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" mb={2}>
        <Typography variant="h5">Data: {new Date(game?.gameDate).toLocaleString()}</Typography>
        <Typography variant="h5">
          GDA {result.homeGoals} - {result.awayGoals} {game?.opponentName}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ConvocationList convocation={sortedConvocation} players={players} gameId={gameId} teamId={teamId} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <GameSummary gameId={gameId} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Histórico de Eventos do Jogo
              </Typography>
              <GameEventsTable gameId={gameId} showActions={false} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default GameDetailPage;