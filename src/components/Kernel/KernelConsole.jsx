import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const KernelConsole = ({ chatState, setChatState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const newMessage = { role: 'user', content: currentInput };
    const updatedMessages = [...chatState.messages, newMessage];

    setCurrentInput('');
    setStatus('submitting');
    setErrorMessage('');

    setChatState({ messages: updatedMessages });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatState({
          messages: [...updatedMessages, { role: 'assistant', content: data.response }],
        });
        setStatus('idle');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
      setChatState({ messages: updatedMessages });
    }
  };

  const handleClearChat = () => {
    setChatState({ messages: [] });
    setErrorMessage('');
    setStatus('idle');
  };

  const activeModule = location.pathname === '/' ? 'HOME' : location.pathname.toUpperCase().replace('/', '');

  const consoleStyle = {
    position: 'fixed',
    right: 0,
    top: 0,
    bottom: 0,
    width: isOpen ? '400px' : '0px',
    backgroundColor: 'var(--os-glass)',
    borderLeft: isOpen ? '1px solid var(--os-accent)' : 'none',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1100,
    fontFamily: 'var(--os-font-mono)',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    color: 'var(--os-text)',
  };

  const headerStyle = {
    padding: '12px',
    borderBottom: '1px solid rgba(204, 255, 0, 0.3)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'var(--os-accent)',
  };

  const messagesStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    fontSize: '13px',
    lineHeight: '1.6',
  };

  const inputAreaStyle = {
    padding: '15px',
    borderTop: '1px solid rgba(204, 255, 0, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  };

  const inputStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--os-accent)',
    color: 'var(--os-text)',
    fontFamily: 'var(--os-font-mono)',
    fontSize: '13px',
    padding: '8px 0',
    outline: 'none',
  };

  return (
    <>
      <div style={consoleStyle}>
        {isOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={headerStyle}>
              <span>ACTIVE_MODULE: {activeModule}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleClearChat} style={{ background: 'none', border: 'none', color: 'var(--os-text)', cursor: 'pointer', fontSize: '12px' }}>RESET</button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--os-text)', cursor: 'pointer', fontSize: '12px' }}>CLOSE</button>
              </div>
            </div>

            <div style={messagesStyle}>
              {chatState.messages.length === 0 && (
                <div style={{ opacity: 0.5, marginBottom: '20px' }}>
                  [SYSTEM] > Kernel initialized. Awaiting commands...
                </div>
              )}

              {chatState.messages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: '12px', whiteSpace: 'pre-wrap' }}>
                  <span style={{ color: msg.role === 'user' ? 'var(--os-text-muted)' : 'var(--os-accent)', fontWeight: 'bold' }}>
                    {msg.role === 'user' ? '[USER]' : '[KERNEL]'}
                  </span>
                  <span style={{ color: 'var(--os-text)' }}> &gt; {msg.content}</span>
                </div>
              ))}

              {status === 'submitting' && (
                <div style={{ marginBottom: '12px', opacity: 0.7 }}>
                  <span style={{ color: 'var(--os-accent)', fontWeight: 'bold' }}>[KERNEL]</span>
                  <span style={{ color: 'var(--os-text)' }}> &gt; processing_request...</span>
                </div>
              )}

              {errorMessage && (
                <div style={{ marginBottom: '12px', color: '#ff4444' }}>
                  [ERROR] &gt; {errorMessage}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={inputAreaStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--os-accent)', fontWeight: 'bold' }}>$</span>
                <input
                  style={inputStyle}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="execute_command..."
                  disabled={status === 'submitting'}
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </div>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: '50px',
          height: '50px',
          borderRadius: '25px',
          backgroundColor: 'var(--os-accent)',
          color: 'var(--os-bg)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 0 15px var(--os-accent)',
          opacity: isOpen ? 0.5 : 1,
          transition: 'opacity 0.3s'
        }}
      >
        {isOpen ? '✕' : 'K'}
      </motion.button>
    </>
  );
};

export default KernelConsole;
