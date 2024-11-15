import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Card, CardContent, FormControlLabel, Checkbox, Grid, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

function PlayerPage() {
  const { playerId, teamId } = useParams();  // Certifique-se que o Router está capturando os IDs
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    goals: 0,
    assists: 0,
    goalsConceded: 0,
    yellowCards: 0,
    redCards: 0,
    saves: 0,
    shotsOnTarget: 0,
    shotsOffTarget: 0,
    freeKicks: 0,
    corners: 0,
    penalties: 0,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const positions = [
    { value: 'GK', label: 'GK (Guarda-redes)' },
    { value: 'DC', label: 'DC (Defesa Central)' },
    { value: 'DE', label: 'DE (Defesa Esquerdo)' },
    { value: 'DD', label: 'DD (Defesa Direito)' },
    { value: 'TR', label: 'TR (Médio Defensivo)' },
    { value: 'MC', label: 'MC (Médio Centro)' },
    { value: 'ME', label: 'ME (Médio Esquerdo)' },
    { value: 'MD', label: 'MD (Médio Direito)' },
    { value: 'MO', label: 'MO (Médio Ofensivo)' },
    { value: 'MOE', label: 'MOE (Médio Ofensivo Esquerdo)' },
    { value: 'MOD', label: 'MOD (Médio Ofensivo Direito)' },
    { value: 'AT', label: 'AT (Atacante)' },
  ];

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/players/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setPlayer(data);
      setSelectedPositions(data.preferredPosition || []);
    })
    .catch(error => console.error('Error fetching player:', error));

    fetch(`${API_URL}/events/player/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setEvents(data);
      const gamesPlayed = new Set(data.map(event => event.gameId)).size;
      const stats = data.reduce((acc, event) => {
        switch (event.type) {
          case 'Goal':
            acc.goals += 1;
            break;
          case 'Assist':
            acc.assists += 1;
            break;
          case 'GoalConceded':
            acc.goalsConceded += 1;
            break;
          case 'YellowCard':
            acc.yellowCards += 1;
            break;
          case 'RedCard':
            acc.redCards += 1;
            break;
          case 'Save':
            acc.saves += 1;
            break;
          case 'ShotOnTarget':
            acc.shotsOnTarget += 1;
            break;
          case 'ShotOffTarget':
            acc.shotsOffTarget += 1;
            break;
          case 'FreeKick':
            acc.freeKicks += 1;
            break;
          case 'Corner':
            acc.corners += 1;
            break;
          case 'Penalty':
            acc.penalties += 1;
            break;
          default:
            break;
        }
        return acc;
      }, {
        gamesPlayed,
        goals: 0,
        assists: 0,
        goalsConceded: 0,
        yellowCards: 0,
        redCards: 0,
        saves: 0,
        shotsOnTarget: 0,
        shotsOffTarget: 0,
        freeKicks: 0,
        corners: 0,
        penalties: 0,
      });
      setStats(stats);
    })
    .catch(error => console.error('Error fetching events:', error));
  }, [playerId, API_URL]);

  const handlePositionChange = () => {
    fetch(`${API_URL}/players/${playerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ...player, preferredPosition: selectedPositions })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao atualizar as posições preferenciais.');
      }
      setUpdateSuccess(true);  // Definir sucesso no feedback
      setTimeout(() => setUpdateSuccess(false), 1000);  // Remover mensagem após 1 segundo
    })
    .catch(error => console.error('Erro ao atualizar as posições preferenciais:', error));
  };

  const handleCheckboxChange = (position) => {
    setSelectedPositions(prevSelectedPositions =>
      prevSelectedPositions.includes(position)
        ? prevSelectedPositions.filter(p => p !== position)
        : [...prevSelectedPositions, position]
    );
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {player.name}
      </Typography>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white', padding: 2, display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(`/team/${teamId}`)}>
          Retroceder
        </Button>
        <Button variant="contained" color="primary" onClick={handlePositionChange}>
          Gravar
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Posição Preferencial
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {positions.map(position => (
                  <FormControlLabel
                    key={position.value}
                    control={
                      <Checkbox
                        checked={selectedPositions.includes(position.value)}
                        onChange={() => handleCheckboxChange(position.value)}
                      />
                    }
                    label={position.label}
                  />
                ))}
              </Box>
              {updateSuccess && (
                <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                  Posições preferenciais atualizadas com sucesso!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas do Jogador
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo de Estatística</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(stats).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell align="right">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PlayerPage;