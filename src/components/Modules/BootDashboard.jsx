import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CountUp = ({ end, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </span>
  );
};

const StatWidget = ({ label, value, suffix, decimals = 0 }) => (
  <motion.div
    className="boot-stat-widget"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      backgroundColor: 'var(--os-glass)',
      border: '1px solid var(--os-accent)',
      padding: '1rem',
      borderRadius: '4px',
      minWidth: '160px',
      textAlign: 'center',
      boxShadow: '0 0 15px rgba(204, 255, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    }}
  >
    <div style={{
      fontSize: '10px',
      color: 'var(--os-text-muted)',
      fontFamily: 'var(--os-font-mono)',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '24px',
      color: 'var(--os-accent)',
      fontFamily: 'var(--os-font-mono)',
      fontWeight: 'bold'
    }}>
      <CountUp end={value} suffix={suffix} decimals={decimals} />
    </div>
  </motion.div>
);

const BootDashboard = ({ onBootComplete }) => {
  const [isBooted, setIsBooted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleInitialize = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsBooted(true);
      setIsTransitioning(false);
      if (onBootComplete) onBootComplete();
    }, 1200);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--os-bg)',
      color: 'var(--os-text)',
      fontFamily: 'var(--os-font-mono)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* White-out/Glitch Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--os-accent)',
              zIndex: 100,
              mixBlendMode: 'difference'
            }}
          />
        )}
      </AnimatePresence>

      {!isBooted && !isTransitioning ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            marginBottom: '2rem',
            fontSize: '12px',
            color: 'var(--os-text-muted)',
            letterSpacing: '4px'
          }}>
            SYSTEM_READY // AWAITING_USER_INPUT
          </div>
          <button
            onClick={handleInitialize}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--os-accent)',
              border: '1px solid var(--os-accent)',
              padding: '1rem 2rem',
              fontSize: '16px',
              fontFamily: 'var(--os-font-mono)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--os-accent)';
              e.target.style.color = 'var(--os-bg)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--os-accent)';
            }}
          >
            [ INITIALIZE_PORTFOLIO ]
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3rem',
            width: '100%',
            maxWidth: '1200px'
          }}
        >
          {/* Profile Terminal */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{
                  x: [0, -2, 2, -1, 0],
                  y: [0, 1, -1, 2, 0],
                  opacity: [1, 0.8, 1, 0.9, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.2,
                  ease: "linear"
                }}
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '2px solid var(--os-accent)',
                  boxShadow: '0 0 20px rgba(204, 255, 0, 0.3)'
                }}
              >
                <img
                  src="/photos/Lumatic_Headshot.jpg"
                  alt="Karthik Nandakumar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                border: '1px solid var(--os-accent)',
                opacity: 0.5,
                animation: 'glitch-border 0.5s infinite'
              }} />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              textAlign: 'left',
              backgroundColor: 'var(--os-glass)',
              padding: '1rem 2rem',
              borderLeft: '4px solid var(--os-accent)',
              backdropFilter: 'blur(10px)'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                transition={{ duration: 0.5 }}
                style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--os-text)' }}
              >
                <span style={{ color: 'var(--os-accent)' }}>USER:</span> KARTHIK_NANDAKUMAR
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontSize: '14px', color: 'var(--os-text-muted)' }}
              >
                <span style={{ color: 'var(--os-accent)' }}>ROLE:</span> GRADUATE_STUDENT_ASU
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 'auto' }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ fontSize: '14px', color: 'var(--os-text-muted)' }}
              >
                <span style={{ color: 'var(--os-accent)' }}>LOC:</span> ARIZONA_STATE_UNIVERSITY
              </motion.div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '800px'
          }}>
            <StatWidget label="TOTAL_PROJECTS" value={13} suffix="+" />
            <StatWidget label="EXPERIENCE_YRS" value={4} suffix="Y" />
            <StatWidget label="CERTIFICATIONS" value={8} suffix="+" />
            <StatWidget label="SISTEM_GPA" value={4.0} decimals={1} />
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes glitch-border {
          0% { clip-path: inset(10% 0 80% 0); transform: translateX(-2px); }
          20% { clip-path: inset(80% 0 10% 0); transform: translateX(2px); }
          40% { clip-path: inset(40% 0 40% 0); transform: translateX(-2px); }
          60% { clip-path: inset(10% 0 80% 0); transform: translateX(2px); }
          80% { clip-path: inset(80% 0 10% 0); transform: translateX(-2px); }
          100% { clip-path: inset(40% 0 40% 0); transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default BootDashboard;
