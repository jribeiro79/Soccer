import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Accordion, AccordionSummary, AccordionDetails, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GetAppIcon from '@mui/icons-material/Addchart';
import { exportToExcel } from '../utils/ExcelExport'; 

function GameSummary({ gameId, opponentName }) {
  const [summary, setSummary] = useState({});
  const [detailedStats, setDetailedStats] = useState({});
  const [eventTypes, setEventTypes] = useState([]);

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
  }, [gameId, API_URL]);

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
  }, [gameId, eventTypes, API_URL]);

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
  }, [gameId, API_URL]);

  const renderAccordionDetails = (eventType) => {
    const eventDetails = detailedStats[eventType];
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

  const handleExcelExport = () => {
    const dataObject = [];

    Object.entries(summary).forEach(([eventType, total]) => {
      const masterRow = {
        Evento: eventType,
        Total: total
      };
      dataObject.push(masterRow);

      if (detailedStats[eventType]) {
        detailedStats[eventType].forEach(detail => {
          const detailRow = {
            Evento: '',
            Total: '',
            Jogador: detail.playerName,
            'Contagem do Jogador': detail.count
          };
          dataObject.push(detailRow);
        });
      }
    });

    exportToExcel(dataObject, `Stats Game GDA vs ${opponentName}`);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Resumo do Jogo
        </Typography>
        <IconButton onClick={handleExcelExport}>
          <GetAppIcon />
        </IconButton>
      </Box>
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