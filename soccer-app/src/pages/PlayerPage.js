import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box, Card, CardContent, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

function PlayerPage() {
  const { playerId } = useParams();
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

  useEffect(() => {
    fetch(`https://localhost:44314/api/players/${playerId}`, {
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

    fetch(`https://localhost:44314/api/events/player/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setEvents(data);
      // Calculate statistics
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
  }, [playerId]);

  const handlePositionChange = () => {
    fetch(`https://localhost:44314/api/players/${playerId}`, {
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
      alert('Posições preferenciais atualizadas com sucesso!');
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
      <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Retroceder
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Card sx={{ flex: 1 }}>
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
            <Button variant="contained" color="primary" onClick={handlePositionChange} sx={{ mt: 2 }}>
              Atualizar Posição
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
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
                <TableRow>
                  <TableCell>Nº Jogos realizados</TableCell>
                  <TableCell align="right">{stats.gamesPlayed}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Golos Marcados</TableCell>
                  <TableCell align="right">{stats.goals}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Assistências</TableCell>
                  <TableCell align="right">{stats.assists}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Golos Sofridos</TableCell>
                  <TableCell align="right">{stats.goalsConceded}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cartões Amarelos</TableCell>
                  <TableCell align="right">{stats.yellowCards}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cartões Vermelhos</TableCell>
                  <TableCell align="right">{stats.redCards}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Defesas</TableCell>
                  <TableCell align="right">{stats.saves}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Remates Enquadrados</TableCell>
                  <TableCell align="right">{stats.shotsOnTarget}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Remates Fora</TableCell>
                  <TableCell align="right">{stats.shotsOffTarget}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Livres Executados</TableCell>
                  <TableCell align="right">{stats.freeKicks}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cantos Executados</TableCell>
                  <TableCell align="right">{stats.corners}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Penaltis Executados</TableCell>
                  <TableCell align="right">{stats.penalties}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default PlayerPage;