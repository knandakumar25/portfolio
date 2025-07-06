import React from 'react';

const OrganizationCard = ({ organizations }) => {
  return (
    <div className="organization-card">
      <div className="organization-header">
        <div className="organization-icon">
          <i className="bi bi-diagram-3-fill"></i>
        </div>
        <div className="organization-meta">
          <h3 className="organization-name" style={{textAlign: 'center'}}>{organizations.name}</h3>
          <h4 className="organization-school" style={{textAlign: 'center'}}>{organizations.school}</h4>
          <h4 className="organization-role" style={{textAlign: 'center'}}>{organizations.role}</h4>
          <div className="organization-duration">{organizations.duration}</div>
        </div>
      </div>
      
      <div className="organization-content">
        <h5 className="activities-title">Activities & Involvement</h5>
        <ul className="activities-list">
          {organizations.activities.map((activity, index) => (
            <li key={index} className="activity-item">
              <i className="bi bi-arrow-right-circle-fill"></i>
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrganizationCard;
