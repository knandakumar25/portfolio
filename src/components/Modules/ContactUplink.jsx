import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactUplink = ({ sendSignal }) => {
  const [step, setStep] = useState(0); // 0: Name, 1: Email, 2: Message, 3: Transmitting, 4: Success
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (step <= 2 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 0) {
        if (formData.name.trim()) {
          setStep(1);
        } else {
          setError('SENDER_NAME_REQUIRED');
        }
      } else if (step === 1) {
        if (validateEmail(formData.email)) {
          setStep(2);
        } else {
          setError('INVALID_EMAIL_FORMAT');
        }
      } else if (step === 2) {
        if (formData.message.trim()) {
          startTransmission();
        } else {
          setError('TRANSMISSION_BODY_REQUIRED');
        }
      }
    }
  };

  const startTransmission = async () => {
    setStep(3);
    setError('');

    // Simulate progress bar animation
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 60));
    }

    try {
      const result = await sendSignal(formData);
      if (result.success) {
        setStep(4);
      } else {
        throw new Error(result.error || 'TRANSMISSION_FAILED');
      }
    } catch (err) {
      setError(err.message);
      setStep(2); // Return to message input
      setProgress(0);
    }
  };

  const currentPrompt = ['SENDER_NAME', 'SENDER_EMAIL', 'TRANSMISSION_BODY'][step];
  const currentField = ['name', 'email', 'message'][step];

  return (
    <div className="signal-terminal" style={{
      backgroundColor: 'var(--os-glass)',
      border: '1px solid var(--os-accent)',
      color: 'var(--os-accent)',
      fontFamily: 'var(--os-font-mono)',
      padding: '20px',
      borderRadius: '4px',
      boxShadow: '0 0 30px rgba(0,0,0,0.6)',
      minHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backdropFilter: 'blur(10px)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div className="terminal-header" style={{
        borderBottom: '1px solid var(--os-accent)',
        marginBottom: '20px',
        paddingBottom: '10px',
        fontSize: '0.75rem',
        opacity: 0.7,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>SIGNAL_UPLINK_v1.0.4</span>
        <span>SECURE_CONNECTION_ESTABLISHED</span>
      </div>

      <div className="terminal-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence mode="wait">
          {step <= 2 && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="prompt-line"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <span style={{ marginRight: '12px', fontWeight: 'bold' }}>{currentPrompt} &gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={formData[currentField]}
                onChange={(e) => setFormData({ ...formData, [currentField]: e.target.value })}
                onKeyDown={handleKeyDown}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  outline: 'none',
                  flex: 1,
                }}
                autoFocus
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="transmitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="transmission-status"
            >
              <div style={{ marginBottom: '15px', fontSize: '0.9rem' }}>TRANSMITTING_SIGNAL...</div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid var(--os-accent)'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                  style={{ height: '100%', backgroundColor: 'var(--os-accent)' }}
                />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', marginTop: '5px', opacity: 0.8 }}>
                {progress}%
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="delivery-confirmation"
              style={{ textAlign: 'center', marginTop: '30px' }}
            >
              <div style={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                marginBottom: '15px',
                textShadow: '0 0 10px var(--os-accent)'
              }}>
                [ SIGNAL_DELIVERED ]
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                TIMESTAMP: {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="terminal-error"
            style={{
              color: '#ff4d4d',
              fontSize: '0.8rem',
              marginTop: '10px',
              fontFamily: 'var(--os-font-mono)'
            }}
          >
            {`> ERROR: ${error}`}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContactUplink;
