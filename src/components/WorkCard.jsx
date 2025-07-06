import React from 'react';

const WorkCard = ({ work }) => {
  return (
    <div className="work-card">
      <div className="work-header">
        <div className="work-icon">
          <i className="bi bi-building"></i>
        </div>
        <div className="work-meta">
          <h3 className="work-company" style={{textAlign: 'center'}}>{work.company}</h3>
          <h4 className="work-position" style={{textAlign: 'center'}}>{work.position}</h4>
          <div className="work-details">
            <span className="work-type">{work.type}</span>
            <span className="work-duration">{work.duration}</span>
          </div>
        </div>
      </div>
      
      <div className="work-content">
        <h5 className="responsibilities-title">Key Responsibilities</h5>
        <ul className="responsibilities-list">
          {work.responsibilities.map((responsibility, index) => (
            <li key={index} className="responsibility-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>{responsibility}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkCard;
