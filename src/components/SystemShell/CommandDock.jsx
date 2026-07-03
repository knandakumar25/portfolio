import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const CommandDock = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Projects', path: '/projects' },
    { name: 'Certifications', path: '/certifications' },
  ];

  const dockStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--os-glass)',
    borderRadius: '16px',
    padding: '8px 16px',
    display: 'flex',
    gap: '12px',
    border: '1px solid rgba(204, 255, 0, 0.3)',
    backdropFilter: 'blur(12px)',
    zIndex: 1000,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  };

  const linkStyle = {
    color: 'var(--os-text)',
    textDecoration: 'none',
    fontSize: '13px',
    fontFamily: 'var(--os-font-mono)',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'color 0.2s',
  };

  return (
    <div style={dockStyle}>
      {navItems.map((item) => (
        <motion.div
          key={item.path}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to={item.path}
            style={({ isActive }) => ({
              ...linkStyle,
              color: isActive ? 'var(--os-accent)' : 'var(--os-text)',
              backgroundColor: isActive ? 'rgba(204, 255, 0, 0.1)' : 'transparent',
            })}
          >
            {item.name}
          </NavLink>
        </motion.div>
      ))}
    </div>
  );
};

export default CommandDock;
