import React from 'react';
import { Button, Box, Divider, useTheme } from '@mui/material';

function EventButtons({ playerId, gameId, onEventAdded }) {
  const theme = useTheme();

  const handleEvent = (type) => {
    const event = {
      playerId,
      gameId,
      type,
      timestamp: new Date().toISOString()
    };

    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(event)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao registar evento.');
      }
      return response.json();
    })
    .then(onEventAdded)
    .catch((error) => console.error('Erro ao registar evento:', error));
  };

  return (
    <Box sx={{ marginBottom: '15px' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={() => handleEvent('Goal')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Golo
        </Button>
        <Button onClick={() => handleEvent('Assist')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Assistência
        </Button>
        <Button onClick={() => handleEvent('Penalty')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Penalti Executado
        </Button>
        <Button onClick={() => handleEvent('PenaltyMissed')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Penalti Falhado
        </Button>
        <Button onClick={() => handleEvent('ShotOnTarget')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Remate Enquadrado
        </Button>
        <Button onClick={() => handleEvent('ShotOffTarget')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Remate Fora
        </Button>
        <Button onClick={() => handleEvent('FreeKick')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Livre Executado
        </Button>
        <Button onClick={() => handleEvent('FreeKickMissed')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Livre Desenquadrado
        </Button>
        <Button onClick={() => handleEvent('Corner')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Canto Executado
        </Button>
        <Button onClick={() => handleEvent('CornerMissed')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.thirdGroup }}>
          Canto Desenquadrado
        </Button>
      </Box>
      
      <Divider sx={{ width: '100%', my: 1, borderColor: 'lightgray' }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={() => handleEvent('Foul')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.secondGroup }}>
          Falta
        </Button>
        <Button onClick={() => handleEvent('SuffersFoul')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.secondGroup }}>
          Sofreu Falta
        </Button>
        <Button onClick={() => handleEvent('YellowCard')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.secondGroup }}>
          Cartão Amarelo
        </Button>
        <Button onClick={() => handleEvent('RedCard')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.secondGroup }}>
          Cartão Vermelho
        </Button>
        <Button onClick={() => handleEvent('Injury')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.secondGroup }}>
          Lesionado
        </Button>
      </Box>
      
      <Divider sx={{ width: '100%', my: 1, borderColor: 'lightgray' }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={() => handleEvent('Save')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.firstGroup }}>
          Defesa
        </Button>
        <Button onClick={() => handleEvent('GoalConceded')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.firstGroup }}>
          Golo Sofrido
        </Button>
        <Button onClick={() => handleEvent('PenaltySaved')} variant="contained" sx={{ flex: '1 0 30%', backgroundColor: theme.palette.eventGroups.firstGroup }}>
          Penalti Defendido
        </Button>
      </Box>
    </Box>
  );
}

export default EventButtons;