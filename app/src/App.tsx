import React from 'react';
import './App.css';
import Lights from './Lights/Lights';
import Login from './Login/Login';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Login></Login>
        <Lights></Lights>
      </header>
    </div>
  );
}

export default App;
