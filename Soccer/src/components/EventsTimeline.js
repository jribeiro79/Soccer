import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function EventsTimeline({ gameId }) {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState(new Map());

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    // Buscar eventos pelo gameId
    fetch(`${API_URL}/events/game/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar eventos do jogo.');
      }
      return response.json();
    })
    .then(data => setEvents(data))
    .catch(error => console.error('Erro ao buscar eventos:', error));
  }, [gameId]);

  useEffect(() => {
    // Buscar todos os jogadores
    fetch(`${API_URL}/players`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores.');
      }
      return response.json();
    })
    .then(data => {
      const playersMap = new Map(data.map(player => [player.id, player.name]));
      setPlayers(playersMap);
    })
    .catch(error => console.error('Erro ao buscar jogadores:', error));
  }, []);

  return (
    <div>
      <Typography variant="h6">Resumo Cronológico dos Eventos</Typography>
      <List>
        {events.map(event => (
          <ListItem key={event.id}>
            <ListItemText
              primary={`${event.type} - ${new Date(event.timestamp).toLocaleString()}`}
              secondary={`Jogador: ${players.get(event.playerId) || event.playerId}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default EventsTimeline;