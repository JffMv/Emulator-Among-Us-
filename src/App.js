// src/App.js
import React, { useState } from 'react';
import './App.css';
import GameComponent from './GameComponent';

function App() {
  const [screen, setScreen] = useState('welcome');
  const [name, setName] = useState('');

  const handlePlayClick = () => {
    setScreen('enterName');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePlayGameClick = () => {
    setScreen('game');
  };
  const playerName = name || 'Player';

  return (
      <>
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
              <input type="text" id={'player'} defaultValue={'Player'} value={name} placeholder={'Player'} onChange={handleNameChange} />
              <button onClick={handlePlayGameClick}>Jugar</button>
            </div>
        )}
        {screen === 'game' && <GameComponent playerName= {playerName}/>}
      </div>
      </>
  );
}

export default App;
