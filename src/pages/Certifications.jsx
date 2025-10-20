import React from 'react';
import CertificationCard from '../components/CertificationCard';
import certificationsData from '../data/certifications.json';
import '../assets/certifications.css';

const Certifications = () => {
  // Inline styles for RTL protection - be careful not to affect card content
  const sectionCenterStyle = {
    direction: 'ltr',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
  
  const textCenterOnly = {
    textAlign: 'center',
    direction: 'ltr'
  };

  const gridCenterStyle = {
    direction: 'ltr'
  };

  return (
    <div className="certifications-container">
      {/* Hero Section */}
      <div className="certifications-hero">
        <div className="container text-center" style={sectionCenterStyle}>
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={textCenterOnly}>Certifications</h1>
          <p className="hero-subtitle rtl-center-protect" style={textCenterOnly}>Professional achievements and continuous learning</p>
          <div className="hero-divider" style={sectionCenterStyle}></div>
        </div>
      </div>

      {/* Certifications Section */}
      <section className="certifications-section">
        <div className="container">
          <div className="certifications-grid" style={gridCenterStyle}>
            {certificationsData.map(certification => (
              <CertificationCard key={certification.id} certification={certification} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Certifications;
