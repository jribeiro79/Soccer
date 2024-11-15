import React, { useEffect, useState } from 'react';

function PlayerGameStats({ playerId, gameId }) {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ goals: 0, assists: 0, fouls: 0, sufferedFouls: 0 });

  // Importa a variável de ambiente
  const API_URL = process.env.REACT_APP_API_URL;
  
  useEffect(() => {
    fetch(`${API_URL}/events/game/${gameId}/player/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar eventos do jogador.');
      }
      return response.json();
    })
    .then(data => setEvents(data))
    .catch(error => console.error('Erro ao buscar eventos:', error));
  }, [playerId, gameId, API_URL]);

  useEffect(() => {
    // Calcular estatísticas
    const newStats = events.reduce((acc, event) => {
      switch (event.type) {
        case 'Goal':
          acc.goals += 1;
          break;
        case 'Assist':
          acc.assists += 1;
          break;
        case 'Foul':
          acc.fouls += 1;
          break;
        case 'SuffersFoul':
          acc.sufferedFouls += 1;
          break;
        default:
          break;
      }
      return acc;
    }, { goals: 0, assists: 0, fouls: 0, sufferedFouls: 0 });

    setStats(newStats);
  }, [events]);

  return (
    <div>
      <h3>Estatísticas do Jogo</h3>
      <ul>
        <li>Golos: {stats.goals}</li>
        <li>Assistências: {stats.assists}</li>
        <li>Faltas Cometidas: {stats.fouls}</li>
        <li>Faltas Sofridas: {stats.sufferedFouls}</li>
      </ul>
    </div>
  );
}

export default PlayerGameStats;