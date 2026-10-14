import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const OrganizationCard = (props) => {
  const organizations = props.organizations || props.org || props.item || props;
  if (!organizations) return null;
  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-100">
      <div className="exp-modal-3d-card organization-card-3d">
        <div className="exp-3d-header">
          <div className="exp-3d-icon-badge badge-cyan">
            <i className="bi bi-diagram-3-fill"></i>
          </div>
          <div className="exp-3d-meta">
            <h3 className="exp-3d-title">{organizations.name}</h3>
            <h4 className="exp-3d-subtitle">{organizations.role} • {organizations.school}</h4>
            <div className="exp-3d-pills">
              <span className="exp-pill font-mono">Organization</span>
              <span className="exp-pill font-mono">
                <i className="bi bi-calendar3 me-1"></i>
                {organizations.duration}
              </span>
            </div>
          </div>
        </div>
        
        <div className="exp-3d-body">
          <div className="exp-responsibilities-block">
            <h5 className="exp-block-heading font-mono">
              <i className="bi bi-lightning-charge me-1 text-cyan"></i> Activities &amp; Leadership
            </h5>
            <ul className="exp-3d-list">
              {(organizations.activities || []).map((activity, index) => (
                <motion.li
                  key={index}
                  className="exp-3d-list-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <span className="exp-check-icon">
                    <i className="bi bi-arrow-right-circle-fill"></i>
                  </span>
                  <span className="exp-list-text">{activity}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
};

export default OrganizationCard;
