import React from 'react';

const SoftwareCard = ({ project }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{project.title}</h4>
        <h6 className="text-muted mb-3">Duration: {project.duration}</h6>
        <p className="card-text">{project.description}</p>
        
        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="skills-container">
            <h6 className="mb-2">Skills & Technologies:</h6>
            <div>
              {project.skills.slice(0, 8).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {project.skills.length > 8 && (
                <span className="skill-tag">+{project.skills.length - 8} more</span>
              )}
            </div>
          </div>
        )}

        {/* Contributors */}
        {project.contributors && project.contributors.length > 0 && (
          <div className="contributors-section">
            <h6>Contributors:</h6>
            <ul className="list-unstyled mb-0">
              {project.contributors.map((contributor, index) => (
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

        {/* Project Links */}
        {project.links && project.links.length > 0 && (
          <div className="project-links">
            {project.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="btn btn-outline-success"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-file-text me-1"></i>
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareCard;
