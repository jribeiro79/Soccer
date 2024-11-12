import React, { useState, useEffect } from 'react';
import { fetchPlayerEvents, createPlayerEvent } from '../api';
import { Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';
import { Container } from 'reactstrap';

function PlayerEvents({ playerId }) {
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState('');

  useEffect(() => {
    fetchPlayerEvents(playerId).then((response) => setEvents(response.data));
  }, [playerId]);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    createPlayerEvent(playerId, { type: eventType }).then((response) => {
      setEvents([...events, response.data]);
    });
  };

  return (
    <Container>
      <h2>Player Events</h2>
      <form onSubmit={handleEventSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Selecione o Evento</InputLabel>
          <Select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <MenuItem value="Goal">Goal</MenuItem>
            <MenuItem value="Assist">Assist</MenuItem>
            <MenuItem value="Foul">Foul</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit">
          Adicionar Evento
        </Button>
      </form>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.type}</li>
        ))}
      </ul>
    </Container>
  );
}

export default PlayerEvents;