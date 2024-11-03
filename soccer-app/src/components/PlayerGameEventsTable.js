import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

function PlayerGameEventsTable({ gameId, playerId, showActions = false, onEventRemoved, refreshEvents }) {
  const [events, setEvents] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchEvents = useCallback(() => {
    console.log("Fetching events for Game ID:", gameId); // Verificar se o gameId está correto
    console.log("Fetching events for Player ID:", playerId); // Verificar se o playerId está correto

    // Buscar eventos pelo gameId e playerId
    fetch(`${API_URL}/events/player/${playerId}?gameId=${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar eventos do jogador no jogo.');
      }
      return response.json();
    })
    .then(data => setEvents(data))
    .catch(error => console.error('Erro ao buscar eventos:', error));
  }, [gameId, playerId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (refreshEvents) {
      refreshEvents(fetchEvents);
    }
  }, [refreshEvents, fetchEvents]);

  const handleRemoveEvent = (eventId) => {
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
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      if (onEventRemoved) {
        onEventRemoved(eventId);
      }
    })
    .catch(error => console.error('Erro ao remover evento:', error));
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Histórico de Eventos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Evento</TableCell>
              <TableCell>Data</TableCell>
              {showActions && <TableCell>Ação</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {events.length > 0 ? (
              events.map(event => (
                <TableRow key={event.id}>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                  {showActions && (
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleRemoveEvent(event.id)}>
                        Remover
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={showActions ? 3 : 2} align="center">
                  Nenhum evento disponível.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PlayerGameEventsTable;