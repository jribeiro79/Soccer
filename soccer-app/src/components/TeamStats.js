import React, { useEffect, useState } from 'react';

function TeamStats({ teamId }) {
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState(new Map());
  const [stats, setStats] = useState({});

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    fetch(`${API_URL}/events/team/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar eventos.');
      }
      return response.json();
    })
    .then(data => setEvents(data))
    .catch(error => console.error('Erro ao buscar eventos:', error));

    fetch(`${API_URL}/teams/${teamId}/players`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores.');
      }
      return response.json();
    })
    .then(data => {
      const playersMap = new Map(data.map(player => [player.id, player.name]));
      setPlayers(playersMap);
    })
    .catch(error => console.error('Erro ao buscar jogadores:', error));
  }, [teamId]);

  useEffect(() => {
    // Calcular estatísticas por jogador
    const statsPerPlayer = events.reduce((acc, event) => {
      if (!acc[event.playerId]) {
        acc[event.playerId] = { goals: 0, assists: 0, fouls: 0, sufferedFouls: 0 };
      }
      switch (event.type) {
        case 'Goal':
          acc[event.playerId].goals += 1;
          break;
        case 'Assist':
          acc[event.playerId].assists += 1;
          break;
        case 'Foul':
          acc[event.playerId].fouls += 1;
          break;
        case 'SuffersFoul':
          acc[event.playerId].sufferedFouls += 1;
          break;
        default:
          break;
      }
      return acc;
    }, {});

    setStats(statsPerPlayer);
  }, [events]);

  return (
    <div>
      <h3>Estatísticas da Equipa</h3>
      <ul>
        {Object.entries(stats).map(([playerId, playerStats]) => (
          <li key={playerId}>
            <b>{players.get(playerId) || playerId}</b>:
            <ul>
              <li>Golos: {playerStats.goals}</li>
              <li>Assistências: {playerStats.assists}</li>
              <li>Faltas Cometidas: {playerStats.fouls}</li>
              <li>Faltas Sofridas: {playerStats.sufferedFouls}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamStats;