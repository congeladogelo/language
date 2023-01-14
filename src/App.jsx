import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Translate from './pages/translate';
import NewWords from './pages/new-words';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Translate />} />
      <Route exact path="/new-words" element={<NewWords />} />
    </Routes>
  );
}

export default App;
