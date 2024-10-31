import React from 'react';
import { Button, Box } from '@mui/material';

function EventButtons({ playerId, gameId, onEventAdded }) {
  const handleEvent = (type) => {
    const event = {
      playerId,
      gameId,
      type,
      timestamp: new Date().toISOString()
    };

  // Importa a variável de ambiente
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
    .catch(error => console.error('Erro ao registar evento:', error));
  };

  return (
    <Box sx={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      <Button onClick={() => handleEvent('Goal')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Golo
      </Button>
      <Button onClick={() => handleEvent('Assist')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Assistência
      </Button>
      <Button onClick={() => handleEvent('Foul')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Falta
      </Button>
      <Button onClick={() => handleEvent('SuffersFoul')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Sofreu Falta
      </Button>
      <Button onClick={() => handleEvent('GoalConceded')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Golo Sofrido
      </Button>
      <Button onClick={() => handleEvent('YellowCard')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Cartão Amarelo
      </Button>
      <Button onClick={() => handleEvent('RedCard')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Cartão Vermelho
      </Button>
      <Button onClick={() => handleEvent('Save')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Defesa
      </Button>
      <Button onClick={() => handleEvent('ShotOnTarget')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Remate Enquadrado
      </Button>
      <Button onClick={() => handleEvent('ShotOffTarget')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Remate Fora
      </Button>
      <Button onClick={() => handleEvent('FreeKick')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Livre Executado
      </Button>
      <Button onClick={() => handleEvent('Corner')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Canto Executado
      </Button>
      <Button onClick={() => handleEvent('Penalty')} variant="contained" color="primary" sx={{ flex: '1 0 30%' }}>
        Penalti Executado
      </Button>
    </Box>
  );
}

export default EventButtons;