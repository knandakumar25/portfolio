import React from 'react';
import '../assets/home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="container text-center">
          <div className="hero-content">
            <div className="profile-image-container">
              <div className="image-frame">
                <img 
                  src="/photos/ImageID_56098236_14.jpg" 
                  alt="Karthik Nandakumar" 
                  className="profile-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.warn('Profile image failed to load');
                  }}
                />
              </div>
            </div>
            <h1 className="hero-title anek-devanagari-font" style={{textAlign: 'center'}}>KARTHIK NANDAKUMAR</h1>
            <div className="hero-roles">
              <p className="hero-subtitle" style={{textAlign: 'center'}}>Senior at North Carolina State University</p>
              <p className="hero-detail" style={{textAlign: 'center'}}>College of Engineering</p>
              <p className="hero-position" style={{textAlign: 'center'}}>Project Intern at SunTec Business Solutions</p>
            </div>
            <div className="hero-divider"></div>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <section className="home-section about-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon about-icon">
              <i className="bi bi-person-circle"></i>
            </div>
            <h2 className="section-title anek-devanagari-font" style={{textAlign: 'center'}}>About Me</h2>
            <p className="section-description" style={{textAlign: 'center'}}>
              Passionate developer creating innovative solutions through code
            </p>
          </div>
          
          <div className="about-content">
            <div className="about-text-card">
              <p className="about-text">
                Computer Science senior at North Carolina State University with hands-on experience in 
                <span className="highlight"> full-stack web development</span>, 
                <span className="highlight"> machine learning</span>, and 
                <span className="highlight"> game design</span>. 
                Proficient in Java, Python, and C, with strong problem-solving, teamwork, and software 
                lifecycle knowledge. Active participant in developer communities and passionate about 
                creating engaging and efficient user-focused applications.
              </p>
            </div>
            
            {/* Skills Showcase */}
            <div className="skills-showcase">
              <h3 className="skills-title anek-devanagari-font" style={{textAlign: 'center'}}>Core Expertise</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <div className="skill-icon">
                    <i className="bi bi-code-slash"></i>
                  </div>
                  <h4 style={{textAlign: 'center'}}>Full-Stack Development</h4>
                  <p style={{textAlign: 'center'}}>React, Node.js, Spring Boot</p>
                </div>
                <div className="skill-card">
                  <div className="skill-icon">
                    <i className="bi bi-robot"></i>
                  </div>
                  <h4 style={{textAlign: 'center'}}>Machine Learning</h4>
                  <p style={{textAlign: 'center'}}>Python, AI Algorithms</p>
                </div>
                <div className="skill-card">
                  <div className="skill-icon">
                    <i className="bi bi-joystick"></i>
                  </div>
                  <h4 style={{textAlign: 'center'}}>Game Development</h4>
                  <p style={{textAlign: 'center'}}>Godot, Interactive Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="home-section stats-section">
        <div className="container">
          <div className="section-header">
            <div className="section-icon stats-icon">
              <i className="bi bi-bar-chart"></i>
            </div>
            <h2 className="section-title anek-devanagari-font" style={{textAlign: 'center'}}>At a Glance</h2>
            <p className="section-description" style={{textAlign: 'center'}}>
              Key achievements and milestones in my journey
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number" style={{textAlign: 'center'}}>7+</div>
              <div className="stat-label" style={{textAlign: 'center'}}>Games Developed</div>
              <div className="stat-icon-small">
                <i className="bi bi-joystick"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{textAlign: 'center'}}>6+</div>
              <div className="stat-label" style={{textAlign: 'center'}}>Software Projects</div>
              <div className="stat-icon-small">
                <i className="bi bi-code-slash"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{textAlign: 'center'}}>8+</div>
              <div className="stat-label" style={{textAlign: 'center'}}>Certifications</div>
              <div className="stat-icon-small">
                <i className="bi bi-award"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{textAlign: 'center'}}>3.7</div>
              <div className="stat-label" style={{textAlign: 'center'}}>GPA</div>
              <div className="stat-icon-small">
                <i className="bi bi-mortarboard"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
