import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function GameStatsTable({ gameId }) {
  const [stats, setStats] = useState({});
  const [players, setPlayers] = useState(new Map());

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    // Buscar estatísticas pelo gameId
    fetch(`${API_URL}/events/game/${gameId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas do jogo.');
      }
      return response.json();
    })
    .then(data => setStats(data))
    .catch(error => console.error('Erro ao buscar estatísticas:', error));

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
  }, [gameId, API_URL]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jogador</TableCell>
            <TableCell>Evento</TableCell>
            <TableCell>Contagem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(stats).map(([playerId, events]) => (
            Object.entries(events).map(([eventType, count]) => (
              <TableRow key={`${playerId}-${eventType}`}>
                <TableCell>{players.get(playerId) || playerId}</TableCell>
                <TableCell>{eventType}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameStatsTable;