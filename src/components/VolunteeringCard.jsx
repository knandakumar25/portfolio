import React from 'react';

const VolunteeringCard = ({ volunteering }) => {
  return (
    <div className="volunteering-card">
      <div className="volunteering-header">
        <div className="volunteering-icon">
          <i className="bi bi-heart-fill"></i>
        </div>
        <div className="volunteering-meta">
          <h3 className="volunteering-organization" style={{textAlign: 'center'}}>{volunteering.organization}</h3>
          <h4 className="volunteering-position" style={{textAlign: 'center'}}>{volunteering.position}</h4>
          <div className="volunteering-duration">{volunteering.duration}</div>
        </div>
      </div>
      
      <div className="volunteering-content">
        <div className="volunteering-cause">
          <div className="cause-label">
            <i className="bi bi-flag-fill"></i>
            <span>Cause</span>
          </div>
          <div className="cause-value">{volunteering.cause}</div>
        </div>
        
        <div className="volunteering-responsibilities">
          <h5 className="responsibilities-title">Contributions</h5>
          <ul className="responsibilities-list">
            {volunteering.responsibilities.map((responsibility, index) => (
              <li key={index} className="responsibility-item">
                <i className="bi bi-heart"></i>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VolunteeringCard;
