import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Card, CardContent, Grid } from '@mui/material';
import EventButtons from '../components/EventButtons';
import PlayerGameEventsTable from '../components/PlayerGameEventsTable';
import PlayerStats from '../components/PlayerStats';

function GamePlayerPage() {
  const { gameId, playerId, teamId } = useParams();  // Certifique-se que o Router está enviando os IDs corretos
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const refreshEventsRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log('Player ID:', playerId); // Verificar se o playerId está correto
    console.log('Game ID:', gameId); // Verificar se o gameId está correto
    console.log('Team ID:', teamId); // Verificar também o teamId

    fetch(`${API_URL}/players/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setPlayer(data))
      .catch((error) => console.error('Error fetching player:', error));
  }, [playerId, gameId, teamId]);

  const handleEventAdded = () => {
    if (refreshEventsRef.current) {
      refreshEventsRef.current();
    }
    // Redirecionar para o detalhe do jogo após adicionar um evento
    navigate(`/team/${teamId}/game/${gameId}`);
  };

  const handleEventRemoved = (eventId) => {
    if (refreshEventsRef.current) {
      refreshEventsRef.current();
    }
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {player.name}
      </Typography>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white', padding: 2, display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/team/${teamId}/game/${gameId}`)} sx={{ mb: 2 }}>
          Retroceder
        </Button>
      </Box>
      <EventButtons playerId={playerId} gameId={gameId} onEventAdded={handleEventAdded} />
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <PlayerStats playerId={playerId} gameId={gameId} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <PlayerGameEventsTable
                gameId={gameId}
                playerId={playerId}
                onEventRemoved={handleEventRemoved}
                showActions={true}
                refreshEvents={(ref) => {
                  refreshEventsRef.current = ref;
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default GamePlayerPage;