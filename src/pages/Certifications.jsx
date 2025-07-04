import React from 'react';
import CertificationCard from '../components/CertificationCard';
import certificationsData from '../data/certifications.json';
import '../assets/certifications.css';

const Certifications = () => {
  return (
    <div className="certifications-container">
      {/* Hero Section */}
      <div className="certifications-hero">
        <div className="container text-center">
          <h1 className="hero-title anek-devanagari-font">Certifications</h1>
          <p className="hero-subtitle">Professional achievements and continuous learning</p>
          <div className="hero-divider"></div>
        </div>
      </div>

      {/* Certifications Section */}
      <section className="certifications-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon">
              <i className="bi bi-award-fill"></i>
            </div>
            <h2 className="section-title anek-devanagari-font">Professional Certifications</h2>
            <p className="section-description">
              Validated skills and expertise across technology domains
            </p>
          </div>
          
          <div className="certifications-grid">
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
