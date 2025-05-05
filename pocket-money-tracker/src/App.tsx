import React from 'react';
import { MoneyProvider } from './context/MoneyContext';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <MoneyProvider>
      <HomePage />
    </MoneyProvider>
  );
}

export default App;
