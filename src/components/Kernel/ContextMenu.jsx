import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../TranslationProvider';

const ContextMenu = ({ chatState, setChatState }) => {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const { browserLang, setBrowserLang } = useTranslation();

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  const handleAction = async (action) => {
    setIsVisible(false);
    window.getSelection().removeAllRanges();

    if (action === 'TRANSLATE') {
      // For this mockup, we'll send a translation request to the AI Kernel
      const prompt = `Translate the following text to ${browserLang}: "${selectedText}"`;
      triggerAiQuery(prompt);
    } else if (action === 'QUERY') {
      triggerAiQuery(selectedText);
    } else if (action === 'ANALYZE') {
      const prompt = `Explain this technical term: ${selectedText}`;
      triggerAiQuery(prompt);
    }
  };

  const triggerAiQuery = async (prompt) => {
    const newMessage = { role: 'user', content: prompt };
    const updatedMessages = [...chatState.messages, newMessage];
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
      }
    } catch (err) {
      console.error('Kernel Context Menu Error:', err);
    }
  };

  const menuStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 2000,
    pointerEvents: 'none',
  };

  const listStyle = {
    pointerEvents: 'auto',
    display: 'flex',
    gap: '1px',
    backgroundColor: 'var(--os-accent)',
    padding: '1px',
    borderRadius: '2px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(204, 255, 0, 0.5)',
  };

  const itemStyle = {
    backgroundColor: 'var(--os-bg)',
    color: 'var(--os-accent)',
    fontFamily: 'var(--os-font-mono)',
    fontSize: '10px',
    padding: '4px 8px',
    cursor: 'pointer',
    border: 'none',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s, color 0.2s',
  };

  return (
    <div style={menuStyle}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            style={{
              position: 'absolute',
              left: menuPosition.x,
              top: menuPosition.y,
              transform: 'translateX(-50%)',
            }}
          >
            <div style={listStyle}>
              <button style={itemStyle} onMouseEnter={(e) => e.target.style.color = 'var(--os-bg)'} onMouseLeave={(e) => e.target.style.color = 'var(--os-accent)'} onClick={() => handleAction('TRANSLATE')}>
                TRANSLATE
              </button>
              <button style={itemStyle} onMouseEnter={(e) => e.target.style.color = 'var(--os-bg)'} onMouseLeave={(e) => e.target.style.color = 'var(--os-accent)'} onClick={() => handleAction('QUERY')}>
                QUERY
              </button>
              <button style={itemStyle} onMouseEnter={(e) => e.target.style.color = 'var(--os-bg)'} onMouseLeave={(e) => e.target.style.color = 'var(--os-accent)'} onClick={() => handleAction('ANALYZE')}>
                ANALYZE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextMenu;
