import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Typography, Container, Box, Card, CardContent, List, ListItem, ListItemText, Grid } from '@mui/material';
import GameEventsTable from '../components/GameEventsTable';
import GameStatsTable from '../components/GameStatsTable';

function GameDetailPage() {
  const { teamId, gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState({});
  const [convocation, setConvocation] = useState([]);

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch game details
    fetch(`${API_URL}/games/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
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
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      const playersMap = {};
      data.forEach(player => {
        playersMap[player.id] = player.name;
      });
      setPlayers(playersMap);
    })
    .catch(error => console.error('Error fetching players:', error));
  }, [teamId, gameId]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Jogo Contra: {game?.opponentName}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Data: {new Date(game?.gameDate).toLocaleString()}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Retroceder
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate(`/team/${teamId}/game/${gameId}/convocation`)}>
          Gerir Convocação
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Jogadores Convocados
              </Typography>
              {convocation.length > 0 ? (
                <List>
                  {convocation.map(playerId => (
                    <ListItem key={playerId} component={Link} to={`/game/${gameId}/player/${playerId}`}>
                      <ListItemText primary={players[playerId] || playerId} sx={{ color: '#1976d2', textDecoration: 'underline' }} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Nenhum jogador convocado.</Typography>
              )}
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
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas dos Jogadores
              </Typography>
              <GameStatsTable gameId={gameId} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default GameDetailPage;