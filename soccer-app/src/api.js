import axios from 'axios';

const API_URL = 'https://localhost:44314/api';

export const fetchTeams = () => axios.get(`${API_URL}/teams`);
export const createTeam = (team) => axios.post(`${API_URL}/teams`, team);
export const fetchPlayers = (teamId) =>
  axios.get(`${API_URL}/teams/${teamId}/players`);
export const fetchPlayerEvents = (playerId) =>
  axios.get(`${API_URL}/players/${playerId}/events`);
export const createPlayerEvent = (playerId, event) =>
  axios.post(`${API_URL}/players/${playerId}/events`, event);