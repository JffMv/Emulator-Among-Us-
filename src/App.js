// src/App.js
import React, { useState } from 'react';
import './App.css';
import GameComponent from './GameComponent';
import { WebSocketProvider } from './WebSocketContext';

function App() {
  const [screen, setScreen] = useState('welcome');
  const [name, setName] = useState('');
  const [playerId, setPlayerId] = useState('');

  const handlePlayClick = () => {
    setScreen('enterName');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePlayGameClick = () => {
    setPlayerId(`player-${Date.now()}`); // Genera un ID único para el jugador
    setScreen('game');
  };

  const playerName = name || 'Player';

  return (
      <div className="App">
        {screen === 'welcome' && (
            <div className="welcome-screen">
              <h1>Bienvenido a Among Us</h1>
              <button onClick={handlePlayClick}>Play</button>
            </div>
        )}
        {screen === 'enterName' && (
            <div className="name-screen">
              <h2>Ingrese su nombre</h2>
              <input
                  type="text"
                  id={'player'}
                  defaultValue={'Player'}
                  value={name}
                  placeholder={'Player'}
                  onChange={handleNameChange}
              />
              <button onClick={handlePlayGameClick}>Jugar</button>
            </div>
        )}
        {screen === 'game' && (
            <WebSocketProvider>
              <GameComponent playerName={playerName} playerId={playerId} />
            </WebSocketProvider>
        )}
      </div>
  );
}

export default App;