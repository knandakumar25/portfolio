import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Import your JSON data
import certificationsData from '../data/certifications.json';
import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';
import workData from '../data/work.json';
import educationData from '../data/education.json';
import organizationsData from '../data/organizations.json';
import volunteeringData from '../data/volunteering.json';

const PortfolioChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Karthik's AI assistant. I can help you learn about his certifications, software projects, game projects, work experience, education, organizations, and volunteering. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const genAI = useRef(null);

  // Initialize the AI when component mounts
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generatePrompt = (userQuestion) => {
    return `You are a helpful, ethical, and context-aware assistant for Karthik Nandakumar's portfolio. Respond clearly and concisely to questions about his background.

Portfolio Data:
CERTIFICATIONS: ${JSON.stringify(certificationsData, null, 2)}
SOFTWARE PROJECTS: ${JSON.stringify(softwareProjectsData, null, 2)}
GAME PROJECTS: ${JSON.stringify(gameProjectsData, null, 2)}
WORK EXPERIENCE: ${JSON.stringify(workData, null, 2)}
EDUCATION: ${JSON.stringify(educationData, null, 2)}
ORGANIZATIONS: ${JSON.stringify(organizationsData, null, 2)}
VOLUNTEERING: ${JSON.stringify(volunteeringData, null, 2)}

User Question: ${userQuestion}

Guidelines:
- Use the exact data provided above
- Be concise and helpful
- If asked about specific items, provide details like titles, dates, skills
- If no relevant data exists, politely say you don't have that information
- Format responses in a conversational way`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !genAI.current) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const model = genAI.current.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
        ],
      });

      const prompt = generatePrompt(inputValue);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage = {
        id: Date.now() + 1,
        text: text,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="chatbot-toggle">
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle position-fixed"
          style={{
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          title="Chat with AI Assistant"
        >
          <i className="bi bi-chat-dots-fill fs-4"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary rounded-circle position-fixed d-lg-none"
        style={{
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
        title="Chat with AI Assistant"
      >
        <i className="bi bi-chat-dots-fill fs-4"></i>
      </button>

      {/* Chat Window */}
      <div
        className="chatbot-window position-fixed bg-white border rounded-3 shadow-lg"
        style={{
          bottom: '20px',
          right: '20px',
          width: '350px',
          height: '500px',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="chatbot-header bg-primary text-white p-3 rounded-top-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="bi bi-robot me-2"></i>
            <span className="fw-bold">Portfolio Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-sm text-white p-0"
            style={{ fontSize: '1.2rem' }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages flex-grow-1 p-3 overflow-auto" style={{ maxHeight: '350px' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message mb-3 ${message.isBot ? 'bot-message' : 'user-message'}`}
            >
              <div
                className={`p-2 rounded-3 ${
                  message.isBot
                    ? 'bg-light text-dark me-4'
                    : 'bg-primary text-white ms-4'
                }`}
                style={{
                  maxWidth: '85%',
                  marginLeft: message.isBot ? '0' : 'auto',
                  marginRight: message.isBot ? 'auto' : '0',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {message.text}
              </div>
              {message.isBot && (
                <small className="text-muted ms-1">
                  <i className="bi bi-robot me-1"></i>
                  AI Assistant
                </small>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message mb-3 bot-message">
              <div className="bg-light text-dark me-4 p-2 rounded-3">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input p-3 border-top">
          <div className="input-group">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about certifications, projects, experience, education..."
              className="form-control"
              rows="2"
              disabled={isLoading}
              style={{ resize: 'none', fontSize: '0.9rem' }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="btn btn-primary"
              type="button"
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CSS for typing animation */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #6c757d;
          border-radius: 50%;
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .chatbot-window {
            width: calc(100vw - 40px) !important;
            height: calc(100vh - 100px) !important;
            bottom: 10px !important;
            right: 20px !important;
            left: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioChatbot;
