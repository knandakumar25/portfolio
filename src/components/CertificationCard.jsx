import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const CertificationCard = ({ certification }) => {
  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-100">
      <div className="certification-card-3d">
        {/* Badge or Icon Header */}
        <div className="cert-3d-header">
          {certification.embedCode ? (
            <div 
              className="cert-embed-badge-wrap"
              dangerouslySetInnerHTML={{ __html: certification.embedCode }}
            />
          ) : certification.badgeImage ? (
            <div className="cert-badge-frame-3d">
              <a
                href={certification.link}
                target="_blank"
                rel="noopener noreferrer"
                title={certification.title}
              >
                <img src={certification.badgeImage} alt={certification.title} className="cert-badge-img" />
              </a>
            </div>
          ) : (
            <div className="cert-icon-seal-3d">
              <i className="bi bi-award-fill"></i>
            </div>
          )}

          <div className="cert-meta-3d">
            <span className="cert-issuer-badge font-mono">
              <i className="bi bi-patch-check-fill me-1 text-cyan"></i>
              {certification.issuer}
            </span>
            <h3 className="cert-title-3d">{certification.title}</h3>
            <div className="cert-date-pills">
              <span className="cert-pill font-mono">
                <i className="bi bi-calendar-check me-1"></i>
                Issued: {certification.dateIssued}
              </span>
              {certification.expirationDate && (
                <span className="cert-pill font-mono">
                  Expires: {certification.expirationDate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="cert-content-3d">
          {certification.credentialId && (
            <div className="cert-id-block-3d mb-3">
              <span className="cert-id-label font-mono">
                <i className="bi bi-key-fill me-1"></i> Credential ID:
              </span>
              <span className="cert-id-value-mono font-mono">{certification.credentialId}</span>
            </div>
          )}

          {certification.skills && certification.skills.length > 0 && (
            <div className="cert-skills-block mb-3">
              <h5 className="cert-skills-heading font-mono">Verified Competencies</h5>
              <div className="cert-skills-tags">
                {certification.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="cert-skill-tag-3d"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
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
              className="btn-3d-verify"
            >
              <i className="bi bi-box-arrow-up-right me-2"></i>
              <span>Verify Official Credential</span>
            </a>
          )}
        </div>
      </div>
    </Card3DTilt>
  );
};

export default CertificationCard;
