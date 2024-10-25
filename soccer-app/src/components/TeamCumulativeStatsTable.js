import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function TeamCumulativeStatsTable({ teamId }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch(`https://localhost:44314/api/teams/${teamId}/cumulative-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas acumuladas da equipa.');
      }
      return response.json();
    })
    .then(data => setStats(data))
    .catch(error => console.error('Erro ao buscar estatísticas acumuladas:', error));
  }, [teamId]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tipo de Evento</TableCell>
            <TableCell align="right">Contagem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(stats).map(([eventType, count]) => (
            <TableRow key={eventType}>
              <TableCell component="th" scope="row">
                {eventType}
              </TableCell>
              <TableCell align="right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TeamCumulativeStatsTable;