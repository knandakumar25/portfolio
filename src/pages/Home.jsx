import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import '../assets/home.css';
import { centerAlignStyle, centerTextOnly } from '../styles/commonStyles';

// --- Animation variants ---
const heroContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } }
};

const profileVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const staggerGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } }
};

// --- CountUp component ---
const CountUp = ({ end, suffix = '', decimals = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const totalDuration = 1400;
    const steps = 60;
    const increment = end / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        const current = increment * step;
        setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      }
    }, totalDuration / steps);
    return () => clearInterval(timer);
  }, [isInView, end, decimals]);

  return (
    <span ref={ref} className="notranslate">
      {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
    </span>
  );
};

const Home = () => {
  // Inline styles for RTL protection with higher specificity

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="container text-center rtl-center-protect" style={centerAlignStyle}>
          <motion.div
            className="hero-content rtl-center-protect"
            style={centerAlignStyle}
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="profile-image-container rtl-center-protect"
              style={centerAlignStyle}
              variants={profileVariants}
            >
              <div className="image-frame rtl-center-protect" style={centerAlignStyle}>
                <img 
                  src="/photos/Lumatic_Headshot.jpg"
                  alt="Karthik Nandakumar" 
                  className="profile-image rtl-center-protect"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
            <motion.h1
              className="hero-title anek-devanagari-font rtl-center-protect"
              style={centerTextOnly}
              variants={heroItemVariants}
            >
              KARTHIK NANDAKUMAR
            </motion.h1>
            <motion.div className="hero-roles rtl-center-protect" style={centerAlignStyle} variants={heroItemVariants}>
              <p className="hero-subtitle rtl-center-protect" style={centerTextOnly}>Graduate Student at Arizona State University</p>
              <p className="hero-detail rtl-center-protect" style={centerTextOnly}>Ira A. Fulton Schools of Engineering</p>
            </motion.div>
            <motion.div className="hero-divider rtl-center-protect" style={centerAlignStyle} variants={heroItemVariants} />
          </motion.div>
        </div>
      </div>

      {/* About Me Section */}
      <motion.section
        className="home-section about-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.15 }}
      >
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
            <motion.div
              className="about-text-card glass-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="about-text rtl-center-protect" style={centerTextOnly}>
                Computer Science graduate (B.S., Summa Cum Laude, NCSU) now pursuing a Master of Science in Computer Science at Arizona State University. Hands-on experience in 
                <span className="highlight"> full-stack web development</span>, 
                <span className="highlight"> machine learning</span>, and 
                <span className="highlight"> game design</span>. 
                Proficient in Java, Python, and C, with strong problem-solving, teamwork, and software 
                lifecycle knowledge. Active participant in developer communities and passionate about 
                creating engaging and efficient user-focused applications.
              </p>
            </motion.div>
            
            {/* Skills Showcase */}
            <div className="skills-showcase">
              <h3 className="skills-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>Core Expertise</h3>
              <motion.div
                className="skills-grid"
                variants={staggerGridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div className="skill-card glass-card" variants={cardVariants}>
                  <div className="skill-icon rtl-center-protect" style={centerAlignStyle}>
                    <i className="bi bi-code-slash"></i>
                  </div>
                  <h4 className="rtl-center-protect" style={centerTextOnly}>Full-Stack Development</h4>
                  <p className="rtl-center-protect" style={centerTextOnly}>React, Node.js, Spring Boot</p>
                </motion.div>
                <motion.div className="skill-card glass-card" variants={cardVariants}>
                  <div className="skill-icon rtl-center-protect" style={centerAlignStyle}>
                    <i className="bi bi-robot"></i>
                  </div>
                  <h4 className="rtl-center-protect" style={centerTextOnly}>Machine Learning</h4>
                  <p className="rtl-center-protect" style={centerTextOnly}>Python, AI Algorithms</p>
                </motion.div>
                <motion.div className="skill-card glass-card" variants={cardVariants}>
                  <div className="skill-icon rtl-center-protect" style={centerAlignStyle}>
                    <i className="bi bi-joystick"></i>
                  </div>
                  <h4 className="rtl-center-protect" style={centerTextOnly}>Game Development</h4>
                  <p className="rtl-center-protect" style={centerTextOnly}>Godot, Interactive Design</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats Section */}
      <motion.section
        className="home-section stats-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.15 }}
      >
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
          <motion.div
            className="stats-grid"
            variants={staggerGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="stat-card glass-card" variants={cardVariants}>
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>
                <CountUp end={7} suffix="+" />
              </div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>Games Developed</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-joystick"></i>
              </div>
            </motion.div>
            <motion.div className="stat-card glass-card" variants={cardVariants}>
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>
                <CountUp end={6} suffix="+" />
              </div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>Software Projects</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-code-slash"></i>
              </div>
            </motion.div>
            <motion.div className="stat-card glass-card" variants={cardVariants}>
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>
                <CountUp end={8} suffix="+" />
              </div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>Certifications</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-award"></i>
              </div>
            </motion.div>
            <motion.div className="stat-card glass-card" variants={cardVariants}>
              <div className="stat-number rtl-center-protect" style={centerTextOnly}>
                <CountUp end={4.0} suffix="" decimals={1} />
              </div>
              <div className="stat-label rtl-center-protect" style={centerTextOnly}>GPA</div>
              <div className="stat-icon-small rtl-center-protect" style={centerAlignStyle}>
                <i className="bi bi-mortarboard"></i>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
