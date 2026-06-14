import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Experiences from './pages/Experiences';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import { TranslationProvider } from './components/TranslationProvider';

import SystemBar from './components/SystemShell/SystemBar';
import CommandDock from './components/SystemShell/CommandDock';
import MainViewport from './components/SystemShell/MainViewport';
import KernelConsole from './components/Kernel/KernelConsole';
import ContextMenu from './components/Kernel/ContextMenu';
import ModuleWrapper from './components/Modules/ModuleWrapper';

import './App.css';

function AnimatedRoutes({ setIsBooted }) {
  const location = useLocation();

  const formatModuleName = (path) => {
    if (path === '/') return 'CORE_SYSTEM';
    const base = path.split('/')[1] || 'UNKNOWN';
    return `${base.toUpperCase()}_MOD`;
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scaleY: 0.01, scaleX: 1 }}
        animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleY: 0.01, scaleX: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ minHeight: '100%' }}
      >
        <ModuleWrapper moduleName={formatModuleName(location.pathname)}>
          <Routes location={location}>
            <Route path="/" element={<Home onBootComplete={setIsBooted} />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
          </Routes>
        </ModuleWrapper>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [chatState, setChatState] = useState({ messages: [] });
  const [isBooted, setIsBooted] = useState(false);

  return (
    <div className="App">
      <div className="os-grid-overlay" />
      <TranslationProvider>
        <Router>
          <ScrollToTop />
          <SystemBar />
          <MainViewport>
            <AnimatedRoutes setIsBooted={setIsBooted} />
          </MainViewport>
          {isBooted && <CommandDock />}
          <Contact />
          <KernelConsole chatState={chatState} setChatState={setChatState} />
          <ContextMenu chatState={chatState} setChatState={setChatState} />
        </Router>
      </TranslationProvider>
    </div>
  );
}

export default App;
