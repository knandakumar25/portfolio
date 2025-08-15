import React from 'react';

const CertificationCard = ({ certification }) => {
  return (
    <div className="certification-card">
      <div className="cert-badge">
        <i className="bi bi-award-fill"></i>
      </div>
      
      <div className="certification-header">
        <h3 className="certification-title">{certification.title}</h3>
        <h4 className="certification-issuer">{certification.issuer}</h4>
        <div className="certification-dates">
          <div className="certification-date">
            <span className="date-label">Issued:</span> {certification.dateIssued}
          </div>
          {certification.expirationDate && (
            <div className="certification-expiry">
              <span className="date-label">Expires:</span> {certification.expirationDate}
            </div>
          )}
        </div>
      </div>
      
      <div className="certification-content">
        <div className="certification-id">
          <div className="id-label">
            <i className="bi bi-key-fill"></i>
            <span>Credential ID</span>
          </div>
          <div className="id-value">{certification.credentialId}</div>
        </div>
        
        {certification.skills && certification.skills.length > 0 && (
          <div className="certification-skills">
            <div className="skills-label">
              <i className="bi bi-gear-fill"></i>
              <span>Skills</span>
            </div>
            <div className="skills-tags">
              {certification.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <a 
          href={certification.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="certification-link"
        >
          <span>View Certificate</span>
          <i className="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
    </div>
  );
};

export default CertificationCard;
