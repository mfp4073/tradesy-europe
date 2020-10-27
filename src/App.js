import React from 'react';
import CountryCountainer from './components/countries/CountryContainer'
import './App.scss';

function App() {
  return (
    <div className="app-container">
      <header className="application-header">
      Let's Go To Europe
      </header>
      <CountryCountainer />
    </div>
  );
}

export default App;
