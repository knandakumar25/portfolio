import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Header from './components/Header';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import GameDetails from './pages/GameDetails';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router basename="/portfolio">
        <ScrollToTop />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/game/:gameId" element={<GameDetails />} />
          </Routes>
        </main>
        <Contact />
      </Router>
    </div>
  );
}

export default App;
