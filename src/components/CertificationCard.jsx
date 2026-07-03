import React from 'react';
import { motion } from 'framer-motion';

const CertificationCard = ({ certification }) => {
  return (
    <div className="certification-card">
      {certification.embedCode ? (
        <div 
          className="academy-badge"
          {/* NOTE: Using dangerouslySetInnerHTML for embed code – ensure the source is trusted to avoid XSS */}
          dangerouslySetInnerHTML={{ __html: certification.embedCode }}
        />
      ) : certification.badgeImage ? (
        <motion.div
          className="academy-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <a
            href={certification.link}
            target="_blank"
            rel="noopener noreferrer"
            title={certification.title}
          >
            <img src={certification.badgeImage} alt={certification.title} />
          </a>
        </motion.div>
      ) : (
        <motion.div
          className="cert-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <i className="bi bi-award-fill"></i>
        </motion.div>
      )}

      <div className={`certification-header${certification.badgeImage || certification.embedCode ? ' certification-header--badge' : ''}`}>
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
        {certification.credentialId && (
          <div className="certification-id">
            <div className="id-label">
              <i className="bi bi-key-fill"></i>
              <span>Credential ID</span>
            </div>
            <div className="id-value">{certification.credentialId}</div>
          </div>
        )}

        {certification.skills && certification.skills.length > 0 && (
          <div className="certification-skills">
            <div className="skills-label">
              <i className="bi bi-gear-fill"></i>
              <span>Skills</span>
            </div>
            <div className="skills-tags">
              {certification.skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="skill-tag"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.06, ease: 'easeOut' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {certification.link && (
          <a
            href={certification.link}
            target="_blank"
            rel="noopener noreferrer"
            className="certification-link"
          >
            <span>View Certificate</span>
            <i className="bi bi-box-arrow-up-right"></i>
          </a>
        )}
      </div>
    </div>
  );
};

export default CertificationCard;

