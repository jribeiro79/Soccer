import React from 'react';
import { Button, Box } from '@mui/material'; // Usar Box no lugar de Grid
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AssistantIcon from '@mui/icons-material/Assistant';
import FaultIcon from '@mui/icons-material/ErrorOutline';
import SuffersIcon from '@mui/icons-material/RemoveCircle';
import RedCardIcon from '@mui/icons-material/HighlightOff';
import YellowCardIcon from '@mui/icons-material/WarningAmber';
import ShieldIcon from '@mui/icons-material/Security';
import GoalIcon from '@mui/icons-material/EmojiEvents';
import PenaltyIcon from '@mui/icons-material/Sports';
import CornerIcon from '@mui/icons-material/SportsSoccer';
import FreeKickIcon from '@mui/icons-material/SportsFootball';

function EventButtons({ playerId, gameId, onEventAdded }) {
  const handleEvent = (type) => {
    const event = {
      playerId,
      gameId,
      type,
      timestamp: new Date().toISOString()
    };

    fetch('https://localhost:44314/api/events', {
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
    .catch(error => console.error('Erro ao registar evento:', error));
  };

  return (
    <Box sx={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <Button startIcon={<SportsSoccerIcon />} onClick={() => handleEvent('Goal')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Golo
      </Button>
      <Button startIcon={<AssistantIcon />} onClick={() => handleEvent('Assist')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Assistência
      </Button>
      <Button startIcon={<FaultIcon />} onClick={() => handleEvent('Foul')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Falta
      </Button>
      <Button startIcon={<SuffersIcon />} onClick={() => handleEvent('SuffersFoul')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Sofreu Falta
      </Button>
      <Button startIcon={<GoalIcon />} onClick={() => handleEvent('GoalConceded')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Golo Sofrido
      </Button>
      <Button startIcon={<YellowCardIcon />} onClick={() => handleEvent('YellowCard')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Cartão Amarelo
      </Button>
      <Button startIcon={<RedCardIcon />} onClick={() => handleEvent('RedCard')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Cartão Vermelho
      </Button>
      <Button startIcon={<ShieldIcon />} onClick={() => handleEvent('Save')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Defesa
      </Button>
      <Button startIcon={<SportsSoccerIcon />} onClick={() => handleEvent('ShotOnTarget')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Remate Enquadrado
      </Button>
      <Button startIcon={<FaultIcon />} onClick={() => handleEvent('ShotOffTarget')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Remate Fora
      </Button>
      <Button startIcon={<FreeKickIcon />} onClick={() => handleEvent('FreeKick')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Livre Executado
      </Button>
      <Button startIcon={<CornerIcon />} onClick={() => handleEvent('Corner')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Canto Executado
      </Button>
      <Button startIcon={<PenaltyIcon />} onClick={() => handleEvent('Penalty')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Penalti Executado
      </Button>
    </Box>
  );
}

export default EventButtons;