import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const WorkCard = (props) => {
  const work = props.work || props.job || props.item || props;
  if (!work) return null;
  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-100">
      <div className="exp-modal-3d-card work-card-3d">
        <div className="exp-3d-header">
          <div className="exp-3d-icon-badge">
            <i className="bi bi-building-fill"></i>
          </div>
          <div className="exp-3d-meta">
            <h3 className="exp-3d-title">{work.company}</h3>
            <h4 className="exp-3d-subtitle">{work.position}</h4>
            <div className="exp-3d-pills">
              <span className="exp-pill font-mono">{work.type}</span>
              <span className="exp-pill font-mono">
                <i className="bi bi-calendar3 me-1"></i>
                {work.duration}
              </span>
            </div>
          </div>
        </div>
        
        {((work.responsibilities && work.responsibilities.length > 0) || (work.skills && work.skills.length > 0)) && (
          <div className="exp-3d-body">
            {work.responsibilities && work.responsibilities.length > 0 && (
              <div className="exp-responsibilities-block mb-4">
                <h5 className="exp-block-heading font-mono">
                  <i className="bi bi-check-all me-1 text-cyan"></i> Key Engineering Impact
                </h5>
                <ul className="exp-3d-list">
                  {work.responsibilities.map((responsibility, index) => (
                    <motion.li
                      key={index}
                      className="exp-3d-list-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                    >
                      <span className="exp-check-icon">
                        <i className="bi bi-check-circle-fill"></i>
                      </span>
                      <span className="exp-list-text">{responsibility}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            
            {work.skills && work.skills.length > 0 && (
              <div className="exp-skills-block">
                <h5 className="exp-block-heading font-mono">
                  <i className="bi bi-cpu-fill me-1 text-cyan"></i> Skills &amp; Stack
                </h5>
                <div className="exp-skills-tags-wrap">
                  {work.skills.map((skill, index) => (
                    <span key={index} className="exp-skill-tag-3d">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card3DTilt>
  );
};

export default WorkCard;
