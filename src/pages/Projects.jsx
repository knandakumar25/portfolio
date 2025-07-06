import React from 'react';
import SoftwareCard from '../components/SoftwareCard';
import GameCard from '../components/GameCard';

import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';

import '../assets/projects.css';

const Projects = () => {
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

  return (
    <div className="projects-container">
      {/* Hero Section */}
      <div className="projects-hero">
        <div className="container text-center rtl-center-protect" style={centerAlignStyle}>
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>My Projects</h1>
          <p className="hero-subtitle rtl-center-protect" style={centerTextOnly}>Explore my journey through code, creativity, and innovation</p>
          <div className="hero-divider rtl-center-protect" style={centerAlignStyle}></div>
        </div>
      </div>

      {/* Software Projects Section */}
      <section className="projects-section software-section">
        <div className="container">
          <div className="section-header rtl-center-protect" style={centerAlignStyle}>
            <div className="section-icon software-icon rtl-center-protect" style={centerAlignStyle}>
              <i className="bi bi-code-slash"></i>
            </div>
            <h2 className="section-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>Software Development</h2>
            <p className="section-description rtl-center-protect" style={centerTextOnly}>
              Full-stack applications, AI implementations, and enterprise solutions
            </p>
          </div>
          <div className="projects-grid">
            {softwareProjectsData.map((project) => (
              <SoftwareCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Game Projects Section */}
      <section className="projects-section game-section">
        <div className="container">
          <div className="section-header rtl-center-protect" style={centerAlignStyle}>
            <div className="section-icon game-icon rtl-center-protect" style={centerAlignStyle}>
              <i className="bi bi-joystick"></i>
            </div>
            <h2 className="section-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>Game Development</h2>
            <p className="section-description rtl-center-protect" style={centerTextOnly}>
              Interactive narratives, puzzle games, and immersive experiences
            </p>
          </div>
          <div className="game-notice">
            <i className="bi bi-info-circle me-2"></i>
            <span className="rtl-center-protect" style={centerTextOnly}>macOS and iOS versions coming soon!</span>
          </div>
          <div className="projects-grid">
            {gameProjectsData.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
