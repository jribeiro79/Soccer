import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Card, CardContent } from '@mui/material';
import EventButtons from '../components/EventButtons';
import PlayerGameEventsTable from '../components/PlayerGameEventsTable';
import PlayerStats from '../components/PlayerStats';

function GamePlayerPage() {
  const { gameId, playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const refreshEventsRef = useRef(null); // Referência para a função de refresh

  useEffect(() => {
    console.log('Player ID:', playerId); // Verificar se o playerId está correto
    console.log('Game ID:', gameId); // Verificar se o gameId está correto

    fetch(`https://localhost:44314/api/players/${playerId}`, {
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
  }, [playerId, gameId]);

  const handleEventAdded = () => {
    if (refreshEventsRef.current) {
      refreshEventsRef.current(); // Chamar a função de refresh para atualizar a tabela
    }
  };

  const handleEventRemoved = (eventId) => {
    if (refreshEventsRef.current) {
      refreshEventsRef.current(); // Chamar a função de refresh para atualizar a tabela
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
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retroceder
      </Button>
      <EventButtons playerId={playerId} gameId={gameId} onEventAdded={handleEventAdded} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <PlayerGameEventsTable
              gameId={gameId}
              playerId={playerId}
              onEventRemoved={handleEventRemoved}
              showActions={true}
              refreshEvents={(ref) => {
                refreshEventsRef.current = ref;
              }} // Passar referência para a função de refresh
            />
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <PlayerStats playerId={playerId} gameId={gameId} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default GamePlayerPage;