import React, { useState } from 'react';

const SoftwareCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleLinkClick = (e, link) => {
    if (link.type === 'document') {
      e.preventDefault();
      setModalUrl(link.url);
      setModalTitle(link.title);
      setShowModal(true);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = modalUrl;
    link.download = modalUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const iframe = document.getElementById('pdf-viewer-iframe');
    if (iframe) {
      iframe.contentWindow.print();
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title" style={{textAlign: 'center'}}>{project.title}</h4>
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
                  target={link.type === 'document' ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  <i className="bi bi-file-text me-1"></i>
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Modal */}
      {showModal && (
        <div className="document-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="document-modal" onClick={(e) => e.stopPropagation()}>
            <div className="document-modal-header">
              <h3>{modalTitle}</h3>
              <div className="document-modal-actions">
                <button 
                  className="btn btn-sm btn-outline-primary me-2" 
                  onClick={handleDownload}
                  title="Download"
                >
                  <i className="bi bi-download"></i> Download
                </button>
                <button 
                  className="btn btn-sm btn-outline-primary me-2" 
                  onClick={handlePrint}
                  title="Print"
                >
                  <i className="bi bi-printer"></i> Print
                </button>
                <button 
                  className="btn btn-sm btn-close" 
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <div className="document-modal-body">
              <iframe
                id="pdf-viewer-iframe"
                src={modalUrl}
                title={modalTitle}
                width="100%"
                height="100%"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoftwareCard;
