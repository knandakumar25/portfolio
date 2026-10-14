import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card3DTilt from './Card3DTilt';

const GameCard = ({ game }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const urlFriendlyTitle = game.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    navigate(`/game/${urlFriendlyTitle}`);
  };

  const getPublicUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <Card3DTilt className="h-100" maxTilt={8} scale={1.025} onClick={handleCardClick}>
      <div className="game-cartridge-card h-100">
        {/* Cartridge Top Grip Ribs */}
        <div className="cartridge-grip-ribs">
          <div className="cartridge-rib"></div>
          <div className="cartridge-rib"></div>
          <div className="cartridge-rib"></div>
        </div>

        {/* Game Visual Cover Display */}
        <div className="cartridge-cover-window">
          {game.image ? (
            <img
              src={getPublicUrl(game.image)}
              alt={game.title}
              className="cartridge-cover-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="cartridge-cover-fallback">
              <i className="bi bi-controller cartridge-cover-icon"></i>
            </div>
          )}
          <div className="cartridge-glare-overlay"></div>
          <span className="cartridge-badge-floating">
            <i className="bi bi-joystick me-1"></i> Interactive Game
          </span>
        </div>

        {/* Cartridge Label & Details */}
        <div className="cartridge-body d-flex flex-column">
          <h4 className="cartridge-title">{game.title}</h4>
          <p className="cartridge-desc flex-grow-1">{game.shortDescription}</p>
          
          <div className="cartridge-footer mt-auto">
            <div className="cartridge-meta-row">
              <span className="cartridge-duration font-mono">
                <i className="bi bi-clock me-1"></i> {game.duration}
              </span>
              <span className="cartridge-genre-tag font-mono">
                {game.skills && game.skills[0] ? game.skills[0] : 'Godot / 2D'}
              </span>
            </div>

            <button className="cartridge-btn-3d" tabIndex="-1">
              <i className="bi bi-play-circle-fill me-2"></i>
              <span>Launch Experience</span>
            </button>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
};

export default GameCard;
