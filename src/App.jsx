import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Contact from './components/Contact';
import Chat from './components/Chat';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import GameDetails from './pages/GameDetails';
import { TranslationProvider } from './components/TranslationProvider';

import SystemBar from './components/SystemShell/SystemBar';
import CommandDock from './components/SystemShell/CommandDock';
import MainViewport from './components/SystemShell/MainViewport';

import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        style={{ minHeight: '100%' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/game/:gameId" element={<GameDetails />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [chatState, setChatState] = useState({ messages: [] });

  return (
    <div className="App">
      <div className="os-grid-overlay" />
      <TranslationProvider>
        <Router>
          <ScrollToTop />
          <SystemBar />
          <MainViewport>
            <AnimatedRoutes />
          </MainViewport>
          <CommandDock />
          <Contact />
          <Chat chatState={chatState} setChatState={setChatState} />
        </Router>
      </TranslationProvider>
    </div>
  );
}

export default App;
