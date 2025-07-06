import React from 'react';

const GameCard = ({ game }) => {
  const getButtonClass = (type) => {
    switch (type) {
      case 'download':
        return 'btn-outline-primary';
      case 'web':
        return 'btn-outline-success';
      default:
        return 'btn-outline-secondary';
    }
  };

  const getButtonIcon = (icon) => {
    return icon || 'bi-link-45deg';
  };

  // Function to get the correct public URL for images and downloads
  const getPublicUrl = (path) => {
    // In development, PUBLIC_URL is empty, in production it's the base path
    const publicUrl = process.env.PUBLIC_URL || '';
    return `${publicUrl}${path}`;
  };

  return (
    <div className="card">
      <div className="card-body">
        {game.image && (
          <img
            src={getPublicUrl(game.image)}
            alt={`${game.title} Title Card`}
            className="game-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        
        <h4 className="card-title" style={{textAlign: 'center'}}>{game.title}</h4>
        <h6 className="text-muted mb-3">Duration: {game.duration}</h6>
        <p className="card-text">{game.description}</p>

        {/* Skills */}
        {game.skills && game.skills.length > 0 && (
          <div className="skills-container">
            <h6 className="mb-2">Skills & Technologies:</h6>
            <div>
              {game.skills.slice(0, 6).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {game.skills.length > 6 && (
                <span className="skill-tag">+{game.skills.length - 6} more</span>
              )}
            </div>
          </div>
        )}

        {/* Contributors */}
        {game.contributors && game.contributors.length > 0 && (
          <div className="contributors-section">
            <h6>Contributors:</h6>
            <ul className="list-unstyled mb-0">
              {game.contributors.map((contributor, index) => (
                <li key={index}>
                  {contributor.linkedin ? (
                    <a 
                      href={contributor.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contributor-link"
                    >
                      {contributor.name}
                    </a>
                  ) : (
                    <span>{contributor.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Game Links */}
        {game.links && game.links.length > 0 && (
          <div className="project-links">
            {game.links.map((link, index) => (
              <a
                key={index}
                href={link.type === 'download' ? getPublicUrl(link.url) : link.url}
                className={`btn ${getButtonClass(link.type)}`}
                target="_blank"
                rel="noopener noreferrer"
                download={link.type === 'download' ? true : undefined}
              >
                <i className={`${getButtonIcon(link.icon)} me-1`}></i>
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
