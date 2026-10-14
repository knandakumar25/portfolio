import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const JobSimulationCard = (props) => {
  const simulations = props.simulations || props.simulation || props.item || props;
  if (!simulations) return null;
  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-100">
      <div className="exp-modal-3d-card job-simulation-card-3d">
        <div className="exp-3d-header">
          <div className="exp-3d-icon-badge badge-amber">
            <i className="bi bi-briefcase-fill"></i>
          </div>
          <div className="exp-3d-meta">
            <h3 className="exp-3d-title">{simulations.company}</h3>
            <h4 className="exp-3d-subtitle">{simulations.position}</h4>
            <div className="exp-3d-pills">
              <span className="exp-pill font-mono">Job Simulation</span>
              <span className="exp-pill font-mono">
                <i className="bi bi-clock me-1"></i>
                {simulations.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="exp-3d-body">
          <div className="exp-responsibilities-block mb-4">
            <h5 className="exp-block-heading font-mono">
              <i className="bi bi-terminal me-1 text-amber"></i> Simulation Highlights
            </h5>
            <ul className="exp-3d-list">
              {(simulations.responsibilities || []).map((responsibility, index) => (
                <motion.li
                  key={index}
                  className="exp-3d-list-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <span className="exp-check-icon icon-amber">
                    <i className="bi bi-check2-circle"></i>
                  </span>
                  <span className="exp-list-text">{responsibility}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {simulations.skills && simulations.skills.length > 0 && (
            <div className="exp-skills-block">
              <h5 className="exp-block-heading font-mono">
                <i className="bi bi-tools me-1 text-amber"></i> Technologies Exercised
              </h5>
              <div className="exp-skills-tags-wrap">
                {simulations.skills.map((skill, index) => (
                  <span key={index} className="exp-skill-tag-3d">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card3DTilt>
  );
};

export default JobSimulationCard;
