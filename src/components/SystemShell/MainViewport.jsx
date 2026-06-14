import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../TranslationProvider';

const MainViewport = ({ children }) => {
  const { browserLang } = useTranslation();
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 300);
    return () => clearTimeout(timer);
  }, [browserLang]);

  const viewportStyle = {
    marginTop: '32px',
    marginBottom: '80px',
    minHeight: 'calc(100vh - 112px)',
    padding: '20px',
    position: 'relative',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'filter 0.2s ease',
    filter: isGlitching ? 'contrast(1.5) brightness(1.2) saturate(1.5) hue-rotate(90deg)' : 'none',
  };

  return (
    <div style={viewportStyle}>
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--os-accent)',
              zIndex: 10,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};

export default MainViewport;
