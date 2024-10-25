import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function GameEventsTable({ gameId }) {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState(new Map());

  useEffect(() => {
    console.log("Game ID:", gameId); // Verificar se o gameId está correto

    // Buscar eventos pelo gameId
    fetch(`https://localhost:44314/api/events/game/${gameId}`, {
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
    fetch(`https://localhost:44314/api/players`, {
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jogador</TableCell>
            <TableCell>Evento</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(event => (
            <TableRow key={event.id}>
              <TableCell>{players.get(event.playerId) || event.playerId}</TableCell>
              <TableCell>{event.type}</TableCell>
              <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameEventsTable;