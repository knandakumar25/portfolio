import React from 'react';
import '../assets/home.css';

const Home = () => {
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
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="container text-center rtl-center-protect" style={centerAlignStyle}>
          <div className="hero-content rtl-center-protect" style={centerAlignStyle}>
            <div className="profile-image-container rtl-center-protect" style={centerAlignStyle}>
              <div className="image-frame rtl-center-protect" style={centerAlignStyle}>
                <img 
                  src="/portfolio/photos/Lumatic_Headshot.jpg" 
                  alt="Karthik Nandakumar" 
                  className="profile-image rtl-center-protect"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>KARTHIK NANDAKUMAR</h1>
            <div className="hero-roles rtl-center-protect" style={centerAlignStyle}>
              <p className="hero-subtitle rtl-center-protect" style={centerTextOnly}>Senior at North Carolina State University</p>
              <p className="hero-detail rtl-center-protect" style={centerTextOnly}>College of Engineering</p>
              <p className="hero-position rtl-center-protect" style={centerTextOnly}>Project Intern at SunTec Business Solutions</p>
            </div>
            <div className="hero-divider rtl-center-protect" style={centerAlignStyle}></div>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <section className="home-section about-section">
        <div className="container">
          <div className="section-header rtl-center-protect" style={centerAlignStyle}>
            <div className="section-icon about-icon rtl-center-protect" style={centerAlignStyle}>
              <i className="bi bi-person-circle"></i>
            </div>
            <h2 className="section-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>About Me</h2>
            <p className="section-description rtl-center-protect" style={centerTextOnly}>
              Passionate developer creating innovative solutions through code
            </p>
          </div>
          
          <div className="about-content">
            <div className="about-text-card">
              <p className="about-text rtl-center-protect" style={centerTextOnly}>
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
              <h3 className="skills-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>Core Expertise</h3>
              <div className="skills-grid">
                <div className="skill-card">
                  <div className="skill-icon rtl-center-protect" style={centerAlignStyle}>
                    <i className="bi bi-code-slash"></i>
                  </div>
                  <h4 className="rtl-center-protect" style={centerTextOnly}>Full-Stack Development</h4>
                  <p className="rtl-center-protect" style={centerTextOnly}>React, Node.js, Spring Boot</p>
                </div>
                <div className="skill-card">
                  <div className="skill-icon rtl-center-protect" style={centerAlignStyle}>
                    <i className="bi bi-robot"></i>
                  </div>
                  <h4 className="rtl-center-protect" style={centerTextOnly}>Machine Learning</h4>
                  <p className="rtl-center-protect" style={centerTextOnly}>Python, AI Algorithms</p>
                </div>
                <div className="skill-card">
                  <div className="skill-icon rtl-center-protect" style={centerAlignStyle}>
                    <i className="bi bi-joystick"></i>
                  </div>
                  <h4 className="rtl-center-protect" style={centerTextOnly}>Game Development</h4>
                  <p className="rtl-center-protect" style={centerTextOnly}>Godot, Interactive Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="home-section stats-section">
        <div className="container">
          <div className="section-header rtl-center-protect" style={centerAlignStyle}>
            <div className="section-icon stats-icon rtl-center-protect" style={centerAlignStyle}>
              <i className="bi bi-bar-chart"></i>
            </div>
            <h2 className="section-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>At a Glance</h2>
            <p className="section-description rtl-center-protect" style={centerTextOnly}>
              Key achievements and milestones in my journey
            </p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>7+</div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>Games Developed</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-joystick"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>6+</div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>Software Projects</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-code-slash"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>8+</div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>Certifications</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-award"></i>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>3.7</div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>GPA</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
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
