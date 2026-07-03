import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModuleWrapper = ({ children, moduleName }) => {
  const [stage, setStage] = useState('loading');

  useEffect(() => {
    setStage('loading');
    const timer = setTimeout(() => {
      setStage('ready');
    }, 800);
    return () => clearTimeout(timer);
  }, [moduleName]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <AnimatePresence mode="wait">
        {stage === 'loading' ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              zIndex: 10,
              fontFamily: 'var(--os-font-mono)',
              color: 'var(--os-accent)',
              fontSize: '1.2rem',
              textAlign: 'center',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}
          >
            <span style={{ display: 'inline-block' }}>
              LOADING_MODULE: {moduleName}...
            </span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              style={{ marginLeft: '2px' }}
            >
              _
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                stiffness: 260,
                damping: 20
              }
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleWrapper;
