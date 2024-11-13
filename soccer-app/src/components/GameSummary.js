import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function GameSummary({ gameId }) {
  const [summary, setSummary] = useState({});
  const [eventTypes, setEventTypes] = useState({});
  const [detailedStats, setDetailedStats] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/events/game/${gameId}/distinct-event-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setEventTypes(data))
      .catch(error => console.error('Error fetching distinct event types:', error));
  }, [gameId]);

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
        const summary = eventTypes.reduce((acc, type) => {
          acc[type] = events.filter(event => event.type === type).length;
          return acc;
        }, {});

        setSummary(summary);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, [gameId, eventTypes]);

  useEffect(() => {
    fetch(`${API_URL}/events/game/${gameId}/player-event-details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setDetailedStats(data))
      .catch(error => console.error('Error fetching detailed player stats:', error));
  }, [gameId]);

  const renderAccordionDetails = (eventType) => {
    const eventDetails = detailedStats[eventType];
    console.log('Event details for', eventType, ':', eventDetails);
    if (!Array.isArray(eventDetails)) {
      return <Typography>Nenhum detalhe encontrado para {eventType}</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome do Jogador</TableCell>
              <TableCell align="right">Contagem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventDetails.map(player => (
              <TableRow key={player.playerId}>
                <TableCell>{player.playerName}</TableCell>
                <TableCell align="right">{player.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

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
                <TableCell colSpan={2}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${eventType}-content`}
                      id={`${eventType}-header`}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography>{eventType}</Typography>
                        <Typography>{count}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {renderAccordionDetails(eventType)}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default GameSummary;