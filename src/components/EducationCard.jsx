import React from 'react';

const EducationCard = ({ education }) => {
  return (
    <div className="education-card">
      <div className="education-header">
        <div className="education-icon">
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <div className="education-meta">
          <h3 className="education-institution">{education.institution}</h3>
          <h4 className="education-degree">{education.degree}</h4>
          <div className="education-duration">{education.duration}</div>
        </div>
      </div>
      
      <div className="education-content">
        <div className="education-stats">
          <div className="stat-item">
            <div className="stat-label">GPA</div>
            <div className="stat-value">{education.gpa}</div>
          </div>
        </div>
        
        {education.societies && education.societies.length > 0 && (
          <div className="education-societies">
            <h5 className="societies-title">Societies & Organizations</h5>
            <div className="societies-list">
              {education.societies.map((society, index) => (
                <span key={index} className="society-tag">
                  <i className="bi bi-people-fill"></i>
                  {society}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {education.skills && education.skills.length > 0 && (
          <div className="education-skills">
            <h5 className="skills-title">Skills Developed</h5>
            <div className="skills-list">
              {education.skills.map((skill, index) => (
                <span key={index} className="education-skill-tag">
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

export default EducationCard;
