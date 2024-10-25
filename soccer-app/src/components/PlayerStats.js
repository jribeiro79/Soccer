import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function PlayerStats({ gameId, playerId }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    console.log(`Fetching stats for player ${playerId} in game ${gameId}`); // Log para verificação

    fetch(`https://localhost:44314/api/events/game/${gameId}/player/${playerId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas do jogador.');
      }
      return response.json();
    })
    .then(data => setStats(data))
    .catch(error => console.error('Erro ao buscar estatísticas:', error));
  }, [gameId, playerId]);

  return (
    <div>
      <Typography variant="h6">Estatísticas do Jogador</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="estatísticas do jogador">
          <TableHead>
            <TableRow>
              <TableCell>Evento</TableCell>
              <TableCell align="right">Contagem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(stats).map(eventType => (
              <TableRow key={eventType}>
                <TableCell component="th" scope="row">
                  {eventType}
                </TableCell>
                <TableCell align="right">{stats[eventType]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default PlayerStats;