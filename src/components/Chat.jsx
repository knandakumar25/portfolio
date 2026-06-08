import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/chat.css';

const Chat = ({ chatState, setChatState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="chat-header">
              <h3>Portfolio Assistant</h3>
              <div className="chat-controls">
                <button
                  className="chat-btn-clear"
                  onClick={handleClearChat}
                  title="Clear chat"
                  aria-label="Clear chat history"
                >
                  ↻
                </button>
                <button
                  className="chat-btn-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="chat-messages">
              <AnimatePresence>
                {chatState.messages.length === 0 && (
                  <motion.div
                    className="chat-welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p>Hello! Ask me anything about the portfolio or my experience.</p>
                  </motion.div>
                )}

                {chatState.messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    className={`chat-message ${msg.role}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="message-content">{msg.content}</div>
                  </motion.div>
                ))}

                {status === 'submitting' && (
                  <motion.div
                    className="chat-message assistant loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    className="chat-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Ask me something..."
                disabled={status === 'submitting'}
                className="chat-input"
              />
              <motion.button
                type="submit"
                disabled={status === 'submitting' || !currentInput.trim()}
                className="chat-submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                →
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`chat-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        💬
      </motion.button>
    </div>
  );
};

export default Chat;
