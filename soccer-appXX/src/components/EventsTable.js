import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function EventsTable({ gameId, showActions = false, onEventRemoved }) {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState(new Map());

  useEffect(() => {
    console.log("Game ID:", gameId); // Verificar se o gameId está correto

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;

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
  }, [gameId]);

  const handleRemoveEvent = (eventId) => {
    // Importa a variável de ambiente
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/events/${eventId}`, {
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
      if (onEventRemoved) {
        onEventRemoved(eventId);  
      }
    })
    .catch(error => console.error('Erro ao remover evento:', error));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jogador</TableCell>
            <TableCell>Evento</TableCell>
            <TableCell>Data</TableCell>
            {showActions && <TableCell>Ação</TableCell>} {/* Nova Coluna para Ação Condicional */}
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => (
            <TableRow key={event.id}>
              <TableCell>{players.get(event.playerId) || event.playerId}</TableCell>
              <TableCell>{event.type}</TableCell>
              <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
              {showActions && (
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleRemoveEvent(event.id)}>
                    Remover
                  </Button>
                </TableCell>
              )} {/* Botão para Remover Evento Condicional */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EventsTable;