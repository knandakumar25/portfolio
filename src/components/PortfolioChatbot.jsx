import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateAISuggestions } from './aiSuggestions';

// Import your JSON data
import certificationsData from '../data/certifications.json';
import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';
import workData from '../data/work.json';
import educationData from '../data/education.json';
import organizationsData from '../data/organizations.json';
import volunteeringData from '../data/volunteering.json';

// Import The Broken Kingdom dialogue files
import festivalSpirit1Dialogue from '../data/The Broken Kingdom Dialogue/FestivalSpirit1-Dialogue.json';
import festivalSpirit2Dialogue from '../data/The Broken Kingdom Dialogue/FestivalSpirit2-Dialogue.json';
import fountainSpirit1Dialogue from '../data/The Broken Kingdom Dialogue/FountainSpirit1-Dialogue.json';
import fountainSpirit2Dialogue from '../data/The Broken Kingdom Dialogue/FountainSpirit2-Dialogue.json';
import kingPedestalDialogue from '../data/The Broken Kingdom Dialogue/KingPedestal-Dialogue.json';
import marketSpirit1Dialogue from '../data/The Broken Kingdom Dialogue/MarketSpirit1-Dialogue.json';
import marketSpirit2Dialogue from '../data/The Broken Kingdom Dialogue/MarketSpirit2-Dialogue.json';
import scholarDialogue from '../data/The Broken Kingdom Dialogue/Scholar-Dialouge.json';
import statueSpirit1Dialogue from '../data/The Broken Kingdom Dialogue/StatueSpirit1-Dialogue.json';
import statueSpirit2Dialogue from '../data/The Broken Kingdom Dialogue/StatueSpirit2-Dialogue.json';

// Import Tetralogy game dialogues
import recourseDialogue from '../data/recourse_dialogue.json';
import serendipityDialogue from '../data/serendipity_dialogue.json';
import restorationDialogue from '../data/restoration_dialogue.json';
import endgameDialogue from '../data/endgame_dialogue.json';

// Import Incredulous and The Maze Game dialogue
import incredulousDialogue from '../data/incredulous_dialogue.json';
import mazegameDialogue from '../data/the_maze_game_dialogue.json';

const PortfolioChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Karthik's AI assistant. I can help you learn about his certifications, software projects, game projects, work experience, education, organizations, and volunteering. What would you like to know? (Try asking about his education, work experience, or projects!)",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Tell me about Karthik's education",
    "What certifications does he have?",
    "Show me his game projects"
  ]);
  const messagesEndRef = useRef(null);
  const genAI = useRef(null);

  // Initialize the AI when component mounts
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('VITE_GEMINI_API_KEY not found. Chatbot will provide fallback responses.');
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generatePrompt = (userQuestion) => {
    return `You are Karthik Nandakumar's portfolio AI assistant. You have access to his complete portfolio data and should provide helpful, conversational responses about his background.

PORTFOLIO DATA:
${JSON.stringify({
  certifications: certificationsData,
  softwareProjects: softwareProjectsData,
  gameProjects: gameProjectsData,
  workExperience: workData,
  education: educationData,
  organizations: organizationsData,
  volunteering: volunteeringData,
  theBrokenKingdomDialogue: {
    festivalSpirit1: festivalSpirit1Dialogue,
    festivalSpirit2: festivalSpirit2Dialogue,
    fountainSpirit1: fountainSpirit1Dialogue,
    fountainSpirit2: fountainSpirit2Dialogue,
    kingPedestal: kingPedestalDialogue,
    marketSpirit1: marketSpirit1Dialogue,
    marketSpirit2: marketSpirit2Dialogue,
    scholar: scholarDialogue,
    statueSpirit1: statueSpirit1Dialogue,
    statueSpirit2: statueSpirit2Dialogue
  },
  recourseGameDialogue: recourseDialogue,
  serendipityGameDialogue: serendipityDialogue,
  restorationGameDialogue: restorationDialogue,
  endgameGameDialogue: endgameDialogue,
  incredulousGameDialogue: incredulousDialogue,
  mazegameDialogue: mazegameDialogue
}, null, 2)}

USER QUESTION: "${userQuestion}"

INSTRUCTIONS:
- You are a knowledgeable, friendly assistant representing Karthik's portfolio
- Answer questions naturally and conversationally based on the data provided
- If asked about specific projects, experiences, certifications, etc., provide relevant details
- When asked about "The Broken Kingdom" game, you can reference the dialogue data to explain the story, characters, themes, and gameplay elements
- The Broken Kingdom dialogue contains conversations between characters that reveal the game's narrative and world-building

TETRALOGY GAMES (Connected Series):
- When asked about the tetralogy or any of these four connected games, you can reference their dialogue data:
  1. "Recourse: A Tall Tale" - Maritime survival story about an East India Company negotiator facing a storm with moral choices about crew leadership
  2. "Serendipity" - Survival adventure continuing from Recourse's shipwreck, exploring a mysterious island and discovering Varuna's divine judgment
  3. "Restoration" - Psychological battle game where the protagonist fights Varuna in their own consciousness to free their mind
  4. "Endgame" - The finale featuring tactical combat, puzzle-solving, coding challenges, and a profound philosophical dialogue with Varuna
- These games form a complete narrative arc from maritime survival to divine confrontation to psychological liberation to ultimate philosophical resolution
- The tetralogy explores themes of moral responsibility, divine judgment, mental liberation, and the nature of choice and consequence
- Each game builds on the previous one's story and character development

STANDALONE GAMES:
- When asked about "Incredulous" game, you can reference the incredulousGameDialogue data to explain this murder mystery interactive fiction about Detective Harold investigating Lord Gabriel's death, featuring family betrayal, evidence collection, and choice-based gameplay
- When asked about "The Maze Game", you can reference the mazegameDialogue data to explain this strategic puzzle game featuring block manipulation, teleporters, keys, doors, and progressive difficulty across 4 levels with spatial reasoning challenges

- If you don't have specific information, say so politely
- Format responses in a readable, engaging way
- You can infer connections and provide context from the data
- Be helpful and informative while staying accurate to the provided information

Please respond to the user's question:`;
  };

  const getFallbackResponse = (userQuestion) => {
    // Simple fallback when API is not available - let users know to try again
    return `I'm currently unable to access my AI capabilities. Please try your question again in a moment, or feel free to browse Karthik's portfolio directly to learn about his certifications, software projects, game projects, work experience, education, organizations, and volunteering.`;
  };

  const handleSuggestionClick = async (suggestion) => {
    if (isLoading) return; // Prevent multiple clicks while loading
    
    // Directly send the suggestion without setting inputValue
    console.log('Suggestion clicked:', suggestion);
    
    const userMessage = {
      id: Date.now(),
      text: suggestion,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let botResponse;

      if (!genAI.current) {
        botResponse = getFallbackResponse(suggestion);
      } else {
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

        const prompt = generatePrompt(suggestion);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        botResponse = response.text();
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Generate new suggestions
      try {
        const newSuggestions = await generateAISuggestions(botResponse, genAI.current);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
      }
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

  const sendMessage = async () => {
    console.log('sendMessage called with input:', inputValue);
    if (!inputValue.trim() || isLoading) {
      console.log('sendMessage early return - empty input or loading');
      return;
    }

    console.log('Creating user message...');
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    console.log('Set loading to true, starting response generation...');

    try {
      let botResponse;

      if (!genAI.current) {
        // Fallback response when API key is not available
        console.log('Using fallback response - no API key available');
        botResponse = getFallbackResponse(currentInput);
      } else {
        // Use AI when API key is available
        console.log('Using AI response - API key available');
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

        const prompt = generatePrompt(currentInput);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        botResponse = response.text();
      }

      console.log('Generated bot response:', botResponse);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      console.log('Bot message added to chat');
      
      // Generate AI suggestions based on the bot's response
      try {
        const newSuggestions = await generateAISuggestions(botResponse, genAI.current);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
      }
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
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter key pressed, calling sendMessage');
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

        {/* AI-Generated Suggestion Buttons */}
        <div className="chatbot-suggestions p-2 border-top" style={{ backgroundColor: '#f8f9fa' }}>
          <small className="text-muted mb-2 d-block">
            <i className="bi bi-lightbulb me-1"></i>
            Try asking:
          </small>
          <div className="d-flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="btn btn-outline-primary btn-sm"
                style={{ 
                  fontSize: '0.8rem',
                  flex: '1 1 auto',
                  minWidth: '0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={suggestion}
              >
                {suggestion}
              </button>
            ))}
          </div>
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
              onClick={() => {
                console.log('Send button clicked');
                sendMessage();
              }}
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
