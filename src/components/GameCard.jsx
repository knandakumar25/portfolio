import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import liquidGlass from '../assets/js/liquid-glass';

const GameCard = ({ game }) => {
  const navigate = useNavigate();
  const glassRef = useRef(null);

  useEffect(() => {
    if (glassRef.current) {
      const glass = liquidGlass(glassRef.current);
      return () => glass.destroy();
    }
  }, []);

  // Handle card click to navigate to game details
  const handleCardClick = () => {
    // Create URL-friendly version of game title
    const urlFriendlyTitle = game.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/game/${urlFriendlyTitle}`);
  };

  return (
    <div 
      ref={glassRef}
      className="card h-100 game-card-clickable glass" 
      onClick={handleCardClick}
    >
      <div className="card-body d-flex flex-column">
        <h4 className="card-title text-center mb-3">{game.title}</h4>
        <p className="card-text flex-grow-1">{game.shortDescription}</p>
        
        <div className="mt-auto">
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {game.duration}
          </small>
          <div className="text-center mt-3">
            <span className="btn btn-outline-primary btn-sm">
              <i className="bi bi-eye me-1"></i>
              View Details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
