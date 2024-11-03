import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Checkbox, FormControlLabel, Card, CardContent, Box } from '@mui/material';

function ConvocationPage() {
  const { teamId, gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate(`/team/${teamId}/game/${gameId}`);
      }, 1000);
    })
    .catch(error => console.error('Erro ao salvar a convocação:', error));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Convocação para o Jogo
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
        </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSaveConvocation}>
          Gravar
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/team/${teamId}/game/${gameId}`)}>
          Retroceder
        </Button>
      </Box>
      {saveSuccess && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          Convocação salva com sucesso!
        </Typography>
      )}
    </Container>
  );
}

export default ConvocationPage;