import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import EventButtons from '../components/EventButtons';
import EventsTable from '../components/EventsTable';

function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`https://localhost:44314/api/games/${gameId}`, {
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
    .then(data => {
      setGame(data);
      setEvents(data.events);
    })
    .catch(error => console.error('Error fetching game:', error));
  }, [gameId]);

  const handleEventAdded = async (newEvent) => {
    await fetch(`https://localhost:44314/api/games/${gameId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newEvent)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao registar evento.');
      }
      return response.json();
    })
    .then(ev => {
      setEvents([...events, ev]);
    })
    .catch(error => console.error('Erro ao registar evento:', error));
  };

  const handleEventRemoved = async (eventId) => {
    await fetch(`https://localhost:44314/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao remover evento.');
      }
      setEvents(events.filter(event => event.id !== eventId));
    })
    .catch(error => console.error('Erro ao remover evento:', error));
  };

  const handleStartGame = async () => {
    await fetch(`https://localhost:44314/api/games/${gameId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao iniciar jogo.');
      }
      setGame({ ...game, isStarted: true });
    })
    .catch(error => console.error('Erro ao iniciar jogo:', error));
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>{game.opponent} - {new Date(game.date).toLocaleString()}</h1>
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
          Retroceder
        </Button>
      {!game.isStarted && <Button variant="contained" color="primary" onClick={handleStartGame}>Iniciar Jogo</Button>}
      {game.isStarted && (
        <>
          <EventButtons playerId={gameId} onEventAdded={handleEventAdded} />
          <EventsTable events={events} onEventRemoved={handleEventRemoved} />
        </>
      )}
    </Container>
  );
}

export default GamePage;