import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import CreateGamePage from './pages/CreateGamePage';
import GameDetailPage from './pages/GameDetailPage';
import GamePlayerPage from './pages/GamePlayerPage';
import AddPlayerPage from './pages/AddPlayerPage';
import CreateTeamPage from './pages/CreateTeamPage';
import ConvocationPage from './pages/ConvocationPage';
import PlayerPage from './pages/PlayerPage'; // Importa a página PlayerPage

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/team/:teamId" element={<TeamPage />} />
      <Route path="/team/:teamId/create-game" element={<CreateGamePage />} />
      <Route path="/team/:teamId/add-player" element={<AddPlayerPage />} />
      <Route path="/team/:teamId/game/:gameId" element={<GameDetailPage />} />
      <Route path="/team/:teamId/game/:gameId/convocation" element={<ConvocationPage />} />
      <Route path="/team/:teamId/game/:gameId/player/:playerId" element={<GamePlayerPage />} />
      <Route path="/game/:gameId/player/:playerId" element={<GamePlayerPage />} />
      <Route path="/player/:playerId" element={<PlayerPage />} /> {/* Nova rota para PlayerPage */}
      <Route path="/create-team" element={<CreateTeamPage />} />                    
      <Route path="/team/:teamId/player/:playerId" element={<PlayerPage />} />        
    </Routes>
  );
}

export default App;