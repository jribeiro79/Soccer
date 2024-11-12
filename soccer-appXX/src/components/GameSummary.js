import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

function GameSummary({ gameId }) {
  const [summary, setSummary] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/events/game/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(events => {
        const eventTypes = ['Goal', 'Assist', 'Foul', 'SuffersFoul', 'GoalConceded', 'YellowCard', 'RedCard', 'Save', 'ShotOnTarget', 'ShotOffTarget', 'FreeKick', 'Corner', 'Penalty'];
        const summary = eventTypes.reduce((acc, type) => {
          acc[type] = events.filter(event => event.type === type).length;
          return acc;
        }, {});

        setSummary(summary);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, [gameId]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Resumo do Jogo
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Evento</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(summary).map(([eventType, count]) => (
              <TableRow key={eventType}>
                <TableCell>{eventType}</TableCell>
                <TableCell align="right">{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default GameSummary;