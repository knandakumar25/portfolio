import React, { useState } from 'react';
import WorkCard from '../components/WorkCard';
import EducationCard from '../components/EducationCard';
import VolunteeringCard from '../components/VolunteeringCard';
import OrganizationCard from '../components/OrganizationCard';

import workData from '../data/work.json';
import educationData from '../data/education.json';
import volunteeringData from '../data/volunteering.json';
import organizationsData from '../data/organizations.json';

import '../assets/experiences.css';

const Experiences = () => {
  const [activeTab, setActiveTab] = useState('work');

  // Inline styles for RTL protection with higher specificity
  const centerAlignStyle = {
    textAlign: 'center',
    direction: 'ltr',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };
  
  const centerTextOnly = {
    textAlign: 'center',
    direction: 'ltr'
  };

  const tabSelectorStyle = {
    textAlign: 'center',
    direction: 'ltr',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const tabs = [
    { id: 'work', label: 'Work Experience', icon: 'bi-briefcase-fill', data: workData, Component: WorkCard },
    { id: 'education', label: 'Education', icon: 'bi-mortarboard-fill', data: educationData, Component: EducationCard },
    { id: 'volunteering', label: 'Volunteering', icon: 'bi-people-fill', data: volunteeringData, Component: VolunteeringCard },
    { id: 'organizations', label: 'Organizations', icon: 'bi-diagram-3-fill', data: organizationsData, Component: OrganizationCard }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="experiences-container">
      {/* Hero Section */}
      <div className="experiences-hero">
        <div className="container text-center" style={centerAlignStyle}>
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>My Journey</h1>
          <p className="hero-subtitle rtl-center-protect" style={centerTextOnly}>Professional experiences, education, and community involvement</p>
          <div className="hero-divider" style={centerAlignStyle}></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <section className="experiences-navigation">
        <div className="container" style={centerAlignStyle}>
          <div className="tab-selector" style={tabSelectorStyle}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={centerTextOnly}
              >
                <div className="tab-icon" style={centerAlignStyle}>
                  <i className={`bi ${tab.icon}`}></i>
                </div>
                <span className="tab-label" style={centerTextOnly}>{tab.label}</span>
                <div className="tab-indicator" style={centerAlignStyle}></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="experiences-content">
        <div className="container">
          <div className="section-header" style={centerAlignStyle}>
            <div className="section-icon" style={centerAlignStyle}>
              <i className={`bi ${activeTabData.icon}`}></i>
            </div>
            <h2 className="section-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>{activeTabData.label}</h2>
          </div>
          
          <div className="experiences-grid">
            {activeTabData.data.map(item => (
              <activeTabData.Component key={item.id} {...{[activeTab]: item}} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experiences;
