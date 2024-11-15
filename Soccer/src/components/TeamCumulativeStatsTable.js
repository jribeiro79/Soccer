import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function TeamCumulativeStatsTable({ teamId }) {
  const [stats, setStats] = useState({});
  const [detailedStats, setDetailedStats] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    fetch(`${API_URL}/teams/${teamId}/cumulative-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setStats(data))
    .catch(error => console.error('Erro ao buscar estatísticas acumuladas da equipa:', error));

    fetch(`${API_URL}/teams/${teamId}/event-details`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setDetailedStats(data);
    })
    .catch(error => console.error('Erro ao buscar detalhes dos eventos:', error));
  }, [teamId, API_URL]);

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
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nome do Jogador</TableCell>
                          <TableCell align="right">Contagem</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailedStats[eventType] && detailedStats[eventType].length > 0 ? (
                          detailedStats[eventType].map(player => (
                            <TableRow key={player.playerId}>
                              <TableCell>{player.playerName}</TableCell>
                              <TableCell align="right">{player.count}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2}>Sem resultados</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TeamCumulativeStatsTable;