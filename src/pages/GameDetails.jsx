import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameProjects from '../data/game_projects.json';


const GameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [showGamePlayer, setShowGamePlayer] = useState(false);

  useEffect(() => {
    // Find game by URL-friendly title instead of ID
    const foundGame = gameProjects.find(g => {
      const urlFriendlyTitle = g.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return urlFriendlyTitle === gameId;
    });
    if (foundGame) {
      setGame(foundGame);
    } else {
      // If game not found, redirect to projects page
      navigate('/projects');
    }
  }, [gameId, navigate]);

  if (!game) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const getButtonClass = (type) => {
    switch (type) {
      case 'download':
        return 'btn-outline-primary';
      case 'web':
        return 'btn-outline-success';
      case 'external':
        return 'btn-outline-success';
      default:
        return 'btn-outline-secondary';
    }
  };

  const getButtonIcon = (icon) => {
    return icon || 'bi-link-45deg';
  };

  const getPublicUrl = (path) => {
    // If it's already an absolute URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (path.startsWith('/portfolio/')) {
      return path;
    }
    const publicUrl = process.env.PUBLIC_URL || '';
    return `${publicUrl}${path}`;
  };

  // Check if game has web version
  const hasWebVersion = game.links && game.links.some(link => link.type === 'web');
  const webGameUrl = hasWebVersion ? game.links.find(link => link.type === 'web')?.url : null;

  // Get embedded game URL for iframe (handle both local and external URLs)
  const getEmbeddedGameUrl = (url) => {
    if (url && url.includes('itch.io')) {
      // Convert itch.io game URLs to embed format
      // Example: https://kn21.itch.io/recourse -> https://kn21.itch.io/recourse/embed
      if (!url.endsWith('/embed')) {
        return url + (url.endsWith('/') ? 'embed' : '/embed');
      }
      return url;
    }
    // For local files, create absolute URL using current origin
    if (url && url.startsWith('/')) {
      // Properly encode the URL to handle spaces and special characters
      const encodedUrl = encodeURI(url);
      return `${window.location.origin}${encodedUrl}`;
    }
    // For relative or absolute URLs, return as-is
    return url;
  };

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/projects')}
          >
            <i className="bi bi-arrow-left"></i> Back to Projects
          </button>
        </div>
      </div>

      {/* Game Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row align-items-start">
            {game.image && (
              <div className="me-md-4 mb-3 mb-md-0">
                <img
                  src={getPublicUrl(game.image)}
                  alt={`${game.title} Title Card`}
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: '300px', height: 'auto' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-grow-1">
              <h1 className="display-4 mb-3">{game.title}</h1>
              <h5 className="text-muted mb-3">
                <i className="bi bi-clock me-2"></i>
                Duration: {game.duration}
              </h5>
              
              {/* Play/Download Actions */}
              <div className="mb-4">
                {hasWebVersion && (
                  <button 
                    className="btn btn-success btn-lg me-3 mb-2"
                    onClick={() => setShowGamePlayer(true)}
                  >
                    <i className="bi bi-play-circle me-2"></i>
                    Play Game
                  </button>
                )}
                
                {/* Download Links */}
                {game.links && game.links.filter(link => link.type === 'download').map((link, index) => (
                  <a
                    key={index}
                    href={getPublicUrl(link.url)}
                    className={`btn ${getButtonClass(link.type)} me-2 mb-2`}
                    download
                  >
                    <i className={`${getButtonIcon(link.icon)} me-1`}></i>
                    {link.title}
                  </a>
                ))}
                
                {/* External Links (open in new tab) */}
                {game.links && game.links.filter(link => link.type === 'external').map((link, index) => {
                  const url = getPublicUrl(link.url);
                  console.log('Raw link URL:', link.url);
                  console.log('Processed URL:', url);
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Navigating to:', url);
                        // Force full page navigation to the external URL
                        window.location.href = url;
                      }}
                      className={`btn ${getButtonClass(link.type)} me-2 mb-2`}
                    >
                      <i className={`${getButtonIcon(link.icon)} me-1`}></i>
                      {link.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Description */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">
                <i className="bi bi-info-circle me-2"></i>
                About This Game
              </h3>
              <p className="card-text">{game.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Technologies */}
      {game.skills && game.skills.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">
                  <i className="bi bi-tools me-2"></i>
                  Skills & Technologies
                </h3>
                <div className="d-flex flex-wrap gap-2">
                  {game.skills.map((skill, index) => (
                    <span key={index} className="badge bg-primary fs-6">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contributors */}
      {game.contributors && game.contributors.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">
                  <i className="bi bi-people me-2"></i>
                  Contributors
                </h3>
                <div className="row">
                  {game.contributors.map((contributor, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-person"></i>
                        </div>
                        <div>
                          {contributor.linkedin ? (
                            <a 
                              href={contributor.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none fw-semibold"
                            >
                              {contributor.name}
                              <i className="bi bi-linkedin ms-1"></i>
                            </a>
                          ) : (
                            <span className="fw-semibold">{contributor.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Player Modal */}
      {showGamePlayer && hasWebVersion && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-joystick me-2"></i>
                  Playing: {game.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowGamePlayer(false)}
                ></button>
              </div>
              <div className="modal-body p-0">
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={getEmbeddedGameUrl(webGameUrl)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allowFullScreen
                    allow="autoplay; fullscreen; gamepad"
                    title={`${game.title} Game Player`}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowGamePlayer(false)}
                >
                  Close Game
                </button>
                <a
                  href={webGameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="bi bi-box-arrow-up-right me-1"></i>
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default GameDetails;
