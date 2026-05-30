import React from 'react';

const JobSimulationCard = ({ simulations }) => {
  return (
    <div className="work-card">
      <div className="work-header">
        <div className="work-icon">
          <i className="bi bi-building"></i>
        </div>
        <div className="work-meta">
          <h3 className="work-company">{simulations.company}</h3>
          <h4 className="work-position">{simulations.position}</h4>
          <div className="work-details">
            <span className="work-duration">{simulations.duration}</span>
          </div>
        </div>
      </div>

      <div className="work-content">
        <h5 className="responsibilities-title">Key Responsibilities</h5>
        <ul className="responsibilities-list">
          {simulations.responsibilities.map((responsibility, index) => (
            <li key={index} className="responsibility-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>{responsibility}</span>
            </li>
          ))}
        </ul>

        {simulations.skills && simulations.skills.length > 0 && (
          <div className="work-skills">
            <h5 className="work-skills-title">Skills & Technologies</h5>
            <div className="work-skills-list">
              {simulations.skills.map((skill, index) => (
                <span key={index} className="work-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSimulationCard;
