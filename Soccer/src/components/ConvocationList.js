import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Card, CardContent, Box, IconButton } from '@mui/material';
import GetAppIcon from '@mui/icons-material/Addchart';
import { exportToExcel } from '../utils/ExcelExport';

function ConvocationList({ convocation, players, gameId, teamId, opponentName }) {
  // Ordenar jogadores convocados por nome
  const sortedConvocation = [...convocation].sort((a, b) => (players[a] || '').localeCompare(players[b] || ''));

  const handleExcelExport = () => {
    const dataObject = sortedConvocation.map(playerId => ({
      Jogador: players[playerId] || playerId,
    }));
    exportToExcel(dataObject, `Convocation List GDA vs ${opponentName}`);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Jogadores Convocados
          </Typography>
          <IconButton onClick={handleExcelExport}>
            <GetAppIcon />
          </IconButton>
        </Box>
        {sortedConvocation.length > 0 ? (
          <List>
            {sortedConvocation.map((playerId) => (
              <ListItem key={playerId} button component={Link} to={`/team/${teamId}/game/${gameId}/player/${playerId}`}>
                <ListItemText primary={players[playerId] || playerId} sx={{ color: '#1976d2', textDecoration: 'underline' }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Nenhum jogador convocado.</Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ConvocationList;