import React from 'react';
import SoftwareCard from '../components/SoftwareCard';
import GameCard from '../components/GameCard';

import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';

import '../assets/projects.css';

const Projects = () => {
  return (
    <div className="projects-container">
      {/* Hero Section */}
      <div className="projects-hero">
        <div className="container text-center">
          <h1 className="hero-title anek-devanagari-font">My Projects</h1>
          <p className="hero-subtitle">Explore my journey through code, creativity, and innovation</p>
          <div className="hero-divider"></div>
        </div>
      </div>

      {/* Software Projects Section */}
      <section className="projects-section software-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon software-icon">
              <i className="bi bi-code-slash"></i>
            </div>
            <h2 className="section-title anek-devanagari-font">Software Development</h2>
            <p className="section-description">
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
          <div className="section-header">
            <div className="section-icon game-icon">
              <i className="bi bi-joystick"></i>
            </div>
            <h2 className="section-title anek-devanagari-font">Game Development</h2>
            <p className="section-description">
              Interactive narratives, puzzle games, and immersive experiences
            </p>
          </div>
          <div className="game-notice">
            <i className="bi bi-info-circle me-2"></i>
            <span>macOS and iOS versions coming soon!</span>
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
