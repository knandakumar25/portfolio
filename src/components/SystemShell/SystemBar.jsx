import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SystemBar = () => {
  const [time, setTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const barStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '32px',
    backgroundColor: 'var(--os-glass)',
    borderBottom: '1px solid var(--os-accent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 12px',
    zIndex: 1000,
    fontFamily: 'var(--os-font-mono)',
    fontSize: '12px',
    color: 'var(--os-text)',
    backdropFilter: 'blur(8px)',
  };

  const statusDotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#00ff00',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '6px',
    boxShadow: '0 0 8px #00ff00',
  };

  return (
    <div style={barStyle}>
      <div>OS_CORE_v1.0</div>
      <div style={{ opacity: 0.8 }}>{time}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={statusDotStyle}
        />
        <span>System Status: Online</span>
      </div>
    </div>
  );
};

export default SystemBar;
