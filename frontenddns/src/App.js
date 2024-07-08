// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DomainPage from './pages/DomainPage';
import LoginPage from './pages/LoginPage';
import RecordsPage from './pages/RecordPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<LoginPage />}
          />
          <Route
            path="/domainlist"
            element={<DomainPage />}
          />
            <Route path="/records//hostedzone/:zoneId" element={<RecordsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
