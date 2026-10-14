import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

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
      <Card3DTilt className="h-100" maxTilt={8} scale={1.02}>
        <div className="software-card-3d h-100">
          <div className="card-body d-flex flex-column">
            {/* Header / Title */}
            <div className="card-3d-header">
              <span className="card-type-tag font-mono">
                <i className="bi bi-cpu-fill me-1"></i> Software Architecture
              </span>
              <span className="card-duration-badge">
                <i className="bi bi-clock me-1"></i> {project.duration}
              </span>
            </div>

            <h3 className="software-card-title">{project.title}</h3>
            <p className="software-card-desc">{project.description}</p>
            
            {/* Skills */}
            {project.skills && project.skills.length > 0 && (
              <div className="software-skills-section mt-auto mb-3">
                <h6 className="software-skills-heading font-mono">Core Stack &amp; Technologies</h6>
                <div className="software-skills-wrap">
                  {project.skills.slice(0, 8).map((skill, index) => (
                    <motion.span
                      key={index}
                      className="software-skill-pill-3d"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: index * 0.05, ease: 'easeOut' }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                  {project.skills.length > 8 && (
                    <span className="software-skill-pill-3d more-pill">
                      +{project.skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Contributors */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="contributors-section mb-3">
                <h6 className="software-skills-heading font-mono">Collaborators</h6>
                <div className="contributors-wrap">
                  {project.contributors.map((contributor, index) => (
                    <div key={index} className="contributor-chip-3d">
                      <i className="bi bi-person-fill"></i>
                      {contributor.linkedin ? (
                        <a 
                          href={contributor.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="contributor-link-3d"
                        >
                          {contributor.name}
                        </a>
                      ) : (
                        <span>{contributor.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Links */}
            {project.links && project.links.length > 0 && (
              <div className="project-links-3d-group mt-2">
                {project.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="btn-3d-action"
                    target={link.type === 'document' ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, link)}
                  >
                    <i className={`bi ${link.type === 'github' ? 'bi-github' : 'bi-file-earmark-pdf-fill'} me-2`}></i>
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card3DTilt>

      {/* Document Modal */}
      {showModal && (
        <div className="document-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="document-modal modal-3d-frame" onClick={(e) => e.stopPropagation()}>
            <div className="document-modal-header">
              <h3 className="modal-title-3d">
                <i className="bi bi-file-earmark-text-fill me-2 text-cyan"></i>
                {modalTitle}
              </h3>
              <div className="document-modal-actions">
                <button 
                  className="btn-3d-sm me-2" 
                  onClick={handleDownload}
                  title="Download"
                >
                  <i className="bi bi-download me-1"></i> Download
                </button>
                <button 
                  className="btn-3d-sm me-2" 
                  onClick={handlePrint}
                  title="Print"
                >
                  <i className="bi bi-printer me-1"></i> Print
                </button>
                <button 
                  className="btn-3d-sm btn-3d-close" 
                  onClick={() => setShowModal(false)}
                  title="Close"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
            <div className="document-modal-body">
              <iframe
                id="pdf-viewer-iframe"
                src={modalUrl}
                title={modalTitle}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoftwareCard;
