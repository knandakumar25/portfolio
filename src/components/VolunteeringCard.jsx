import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const VolunteeringCard = (props) => {
  const volunteering = props.volunteering || props.vol || props.item || props;
  if (!volunteering) return null;
  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-100">
      <div className="exp-modal-3d-card volunteering-card-3d">
        <div className="exp-3d-header">
          <div className="exp-3d-icon-badge badge-rose">
            <i className="bi bi-heart-fill"></i>
          </div>
          <div className="exp-3d-meta">
            <h3 className="exp-3d-title">{volunteering.organization}</h3>
            <h4 className="exp-3d-subtitle">{volunteering.position}</h4>
            <div className="exp-3d-pills">
              <span className="exp-pill font-mono">
                <i className="bi bi-flag-fill me-1 text-rose"></i>
                {volunteering.cause}
              </span>
              <span className="exp-pill font-mono">
                <i className="bi bi-calendar3 me-1"></i>
                {volunteering.duration}
              </span>
            </div>
          </div>
        </div>
        
        <div className="exp-3d-body">
          <div className="exp-responsibilities-block">
            <h5 className="exp-block-heading font-mono">
              <i className="bi bi-heart-pulse me-1 text-rose"></i> Community Contributions
            </h5>
            <ul className="exp-3d-list">
              {(volunteering.responsibilities || []).map((responsibility, index) => (
                <motion.li
                  key={index}
                  className="exp-3d-list-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <span className="exp-check-icon icon-rose">
                    <i className="bi bi-check-circle-fill"></i>
                  </span>
                  <span className="exp-list-text">{responsibility}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
};

export default VolunteeringCard;
