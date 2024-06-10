import './App.css';
import React from 'react';
import UserRoutes from './router/userRoutes';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UserRoutes />
      </header>
    </div>
  );
}

export default App;
