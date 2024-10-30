import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Checkbox, FormControlLabel, Card, CardContent, Box } from '@mui/material';

function ConvocationPage() {
  const { teamId, gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    // Fetch players
    fetch(`${API_URL}/teams/${teamId}/players`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setPlayers(data))
    .catch(error => console.error('Error fetching players:', error));

    // Fetch convocation for the game (if it exists)
    fetch(`${API_URL}/games/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.convocation) {
        setSelectedPlayers(new Set(data.convocation));
      }
    })
    .catch(error => console.error('Error fetching game convocation:', error));
  }, [teamId, gameId]);

  const handleCheckboxChange = (playerId) => {
    setSelectedPlayers(prevSelectedPlayers => {
      const newSelectedPlayers = new Set(prevSelectedPlayers);
      if (newSelectedPlayers.has(playerId)) {
        newSelectedPlayers.delete(playerId);
      } else {
        newSelectedPlayers.add(playerId);
      }
      return newSelectedPlayers;
    });
  };

  const handleSaveConvocation = () => {
    const convocation = Array.from(selectedPlayers);
    fetch(`${API_URL}/games/${gameId}/convocation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(convocation)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao salvar a convocação.');
      }
      alert('Convocação salva com sucesso!');
      navigate(`/team/${teamId}/game/${gameId}`);
    })
    .catch(error => console.error('Erro ao salvar a convocação:', error));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Convocação para o Jogo
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            {players.length > 0 && (
              <div>
                {players.map(player => (
                  <div key={player.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={selectedPlayers.has(player.id)} 
                          onChange={() => handleCheckboxChange(player.id)} 
                          name={player.name} 
                        />
                      }
                      label={player.name}
                    />
                  </div>
                ))}
              </div>
            )}
            <Button variant="contained" color="primary" onClick={handleSaveConvocation} sx={{ mt: 2 }}>
              Salvar Convocação
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
        Retroceder
      </Button>
    </Container>
  );
}

export default ConvocationPage;