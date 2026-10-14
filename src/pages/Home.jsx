import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import DistributedMatrix3D from '../components/DistributedMatrix3D';
import Card3DTilt from '../components/Card3DTilt';
import '../assets/home.css';

// --- Animation variants ---
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
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
  return (
    <div className="home-container">
      {/* 2D + 3D Hybrid Hero Section */}
      <section className="home-hero">
        <div className="container">
          <div className="hero-split-grid">
            {/* Left Column: Razor-Sharp 2D Technical Profile */}
            <motion.div
              className="hero-text-col"
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Live Status Pill */}
              <motion.div className="hero-status-pill" variants={heroItemVariants}>
                <span className="status-indicator-dot" />
                <span>Intern @ LlamaPress AI • Open to Roles</span>
              </motion.div>

              {/* Profile Avatar & Name */}
              <motion.div className="hero-identity-row" variants={heroItemVariants}>
                <div className="hero-avatar-wrapper">
                  <img
                    src="/photos/Lumatic_Headshot.jpg"
                    alt="Karthik Nandakumar"
                    className="hero-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="avatar-online-badge" title="Active Developer">
                    <i className="bi bi-patch-check-fill"></i>
                  </div>
                </div>

                <div className="hero-identity-meta">
                  <h1 className="hero-title">KARTHIK NANDAKUMAR</h1>
                  <p className="hero-role-title">Software Engineer & Systems Researcher</p>
                </div>
              </motion.div>

              {/* Education & Credibility Badges */}
              <motion.div className="hero-credentials" variants={heroItemVariants}>
                <div className="credential-badge">
                  <i className="bi bi-mortarboard-fill"></i>
                  <span><strong>M.S. Computer Science</strong> • Arizona State University (4.0 GPA)</span>
                </div>
                <div className="credential-badge">
                  <i className="bi bi-award-fill"></i>
                  <span><strong>B.S. Computer Science</strong> • NC State (Summa Cum Laude)</span>
                </div>
              </motion.div>

              {/* Mission Summary */}
              <motion.p className="hero-summary" variants={heroItemVariants}>
                Building resilient <strong>distributed microservices</strong>, <strong>high-throughput event pipelines</strong>, 
                and <strong>intelligent systems</strong>. Experienced in Java 25, Apache Kafka, Spring Boot, 
                and machine learning with a strong foundation in algorithm optimization.
              </motion.p>

              {/* Core Architecture Tags */}
              <motion.div className="hero-tech-stack" variants={heroItemVariants}>
                <span className="tech-pill"><i className="bi bi-cpu"></i> Java 25 / Spring Boot 3.5</span>
                <span className="tech-pill"><i className="bi bi-diagram-3"></i> Apache Kafka 4.2</span>
                <span className="tech-pill"><i className="bi bi-hdd-network"></i> Distributed Systems</span>
                <span className="tech-pill"><i className="bi bi-robot"></i> TensorFlow / ML</span>
                <span className="tech-pill"><i className="bi bi-lightning"></i> O(k log k) Algorithms</span>
              </motion.div>

              {/* Call to Actions */}
              <motion.div className="hero-cta-group" variants={heroItemVariants}>
                <Link to="/projects" className="btn-modern-primary">
                  <span>Explore Systems & Projects</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
                <Link to="/experiences" className="btn-modern-secondary">
                  <span>View Experience</span>
                </Link>
                <div className="hero-social-mini">
                  <a
                    href="https://github.com/knandakumar25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-mini-btn"
                    aria-label="GitHub"
                    title="GitHub Profile"
                  >
                    <i className="bi bi-github"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/karthiknandakumar1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-mini-btn"
                    aria-label="LinkedIn"
                    title="LinkedIn Profile"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a
                    href="mailto:karthiknk21@gmail.com"
                    className="social-mini-btn"
                    aria-label="Email"
                    title="Direct Email"
                  >
                    <i className="bi bi-envelope-fill"></i>
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Interactive 3D Distributed Matrix */}
            <motion.div
              className="hero-3d-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <div className="matrix-canvas-card">
                <DistributedMatrix3D />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Engineering Highlights Bento Grid Section */}
      <motion.section
        className="home-section bento-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="container">
          <div className="section-header">
            <div className="section-icon-badge">
              <i className="bi bi-grid-1x2-fill"></i>
            </div>
            <h2 className="section-title anek-devanagari-font">Architecture & Engineering Highlights</h2>
            <p className="section-description">
              Core systems, intelligent algorithms, and production-grade software engineered for reliability and scale.
            </p>
          </div>

          <motion.div
            className="engineering-bento-grid"
            variants={staggerGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Bento 1: Flagship Distributed Systems Project (Cargo Router) */}
            <motion.div className="bento-card-wrapper bento-span-2" variants={cardVariants}>
              <Card3DTilt className="bento-card bento-flagship-card">
                <div className="bento-badge-row">
                  <span className="bento-tag tag-cyan">
                    <i className="bi bi-diagram-3-fill me-1"></i> Featured Distributed System
                  </span>
                  <span className="bento-metric-tag font-mono">Java 25 • KRaft Mode</span>
                </div>

                <div className="bento-content">
                  <h3 className="bento-card-title">Autonomous Cargo Router Microservice</h3>
                  <p className="bento-card-desc">
                    Engineered an event-driven cargo routing microservice using Java 25 virtual threads and 
                    Apache Kafka 4.2. Ingests real-time cargo payloads asynchronously, evaluates live weather risk 
                    across 34 North American freight hubs, and resolves global route optimization in <code className="font-mono text-cyan">O(k log k)</code> time 
                    using a custom Power-of-Two Min-Heap.
                  </p>

                  <div className="bento-features-row">
                    <div className="feature-item">
                      <span className="feature-label">Event Backbone</span>
                      <span className="feature-val">Apache Kafka 4.2 (KRaft)</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-label">Concurrency</span>
                      <span className="feature-val">JDK Virtual Threads</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-label">Path Algorithm</span>
                      <span className="feature-val">O(k log k) Min-Heap</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-label">Quality Assurance</span>
                      <span className="feature-val">36 Mockito Unit Tests</span>
                    </div>
                  </div>

                  <div className="bento-footer-actions">
                    <a
                      href="https://github.com/knandakumar25/cargo-router.git"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bento-link-btn"
                    >
                      <i className="bi bi-github me-1"></i> View Repository
                    </a>
                    <Link to="/projects" className="bento-link-subtle">
                      Explore in Projects <i className="bi bi-chevron-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </Card3DTilt>
            </motion.div>

            {/* Bento 2: Enterprise & Industry Impact */}
            <motion.div className="bento-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="bento-card">
                <div className="bento-badge-row">
                  <span className="bento-tag tag-amber">
                    <i className="bi bi-building-fill me-1"></i> Enterprise Impact
                  </span>
                </div>

                <h3 className="bento-card-title">Production & Corporate Engineering</h3>
                <p className="bento-card-desc">
                  Active software development at <strong>LlamaPress AI</strong> and enterprise banking systems at <strong>SunTec Business Solutions</strong>.
                </p>

                <ul className="bento-bullets">
                  <li>
                    <i className="bi bi-check2-circle text-amber"></i>
                    <span>Corporate invoice engine upgrade using lowagie & JDOM in enterprise Java.</span>
                  </li>
                  <li>
                    <i className="bi bi-check2-circle text-amber"></i>
                    <span>Remediated security vulnerabilities across HTTP client libraries & Axis2 on WebSphere/JBoss.</span>
                  </li>
                  <li>
                    <i className="bi bi-check2-circle text-amber"></i>
                    <span>Resolved CAMT.086 & EDI statement data-parity discrepancies.</span>
                  </li>
                </ul>

                <div className="bento-card-footer mt-auto">
                  <Link to="/experiences" className="bento-link-subtle">
                    View Complete Work History <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>
              </Card3DTilt>
            </motion.div>

            {/* Bento 3: AI & Machine Learning */}
            <motion.div className="bento-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="bento-card">
                <div className="bento-badge-row">
                  <span className="bento-tag tag-purple">
                    <i className="bi bi-cpu-fill me-1"></i> AI & Algorithms
                  </span>
                </div>

                <h3 className="bento-card-title">Intelligent Systems & ML</h3>
                <p className="bento-card-desc">
                  Applying neural networks and decision algorithms to physical and strategic domains.
                </p>

                <div className="bento-micro-list">
                  <div className="micro-list-item">
                    <div className="item-icon-box"><i className="bi bi-hand-index-thumb"></i></div>
                    <div>
                      <strong>SmartHome Gesture Control</strong>
                      <p>Android + TensorFlow CNN classifying hand gestures via camera feed.</p>
                    </div>
                  </div>
                  <div className="micro-list-item">
                    <div className="item-icon-box"><i className="bi bi-grid-3x3"></i></div>
                    <div>
                      <strong>Connect 4 AI Opponent</strong>
                      <p>Heuristic Minimax game bot with alpha-beta pruning defeating baseline agents.</p>
                    </div>
                  </div>
                </div>

                <div className="bento-card-footer mt-auto">
                  <Link to="/projects" className="bento-link-subtle">
                    View AI Projects <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>
              </Card3DTilt>
            </motion.div>

            {/* Bento 4: Interactive Systems & Creative Tech */}
            <motion.div className="bento-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="bento-card">
                <div className="bento-badge-row">
                  <span className="bento-tag tag-pink">
                    <i className="bi bi-joystick me-1"></i> Creative Tech & Games
                  </span>
                  <span className="bento-metric-tag font-mono">7+ Releases</span>
                </div>

                <h3 className="bento-card-title">Interactive Narrative & Mechanics</h3>
                <p className="bento-card-desc">
                  Designing immersive state machines, dialogue trees, and procedural logic across titles like 
                  <em>Recourse</em>, <em>Serendipity</em>, and <em>The Broken Kingdom</em>.
                </p>

                <div className="bento-stats-inline">
                  <div>
                    <span className="stat-highlight">Godot / GDScript</span>
                    <span className="stat-sub">Engine & Physics</span>
                  </div>
                  <div>
                    <span className="stat-highlight">Inkle / Narrative</span>
                    <span className="stat-sub">Dynamic Scripting</span>
                  </div>
                </div>

                <div className="bento-card-footer mt-auto">
                  <Link to="/projects" className="bento-link-subtle">
                    Browse Game Releases <i className="bi bi-chevron-right ms-1"></i>
                  </Link>
                </div>
              </Card3DTilt>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Stats Section with 3D Tilt */}
      <motion.section
        className="home-section stats-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="container">
          <div className="section-header">
            <div className="section-icon-badge">
              <i className="bi bi-speedometer2"></i>
            </div>
            <h2 className="section-title anek-devanagari-font">At a Glance</h2>
            <p className="section-description">
              Key quantitative milestones across graduate research, systems engineering, and credentials.
            </p>
          </div>

          <motion.div
            className="stats-grid"
            variants={staggerGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="stat-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="stat-card glass-card">
                <div className="stat-number">
                  <CountUp end={4.0} suffix="" decimals={1} />
                </div>
                <div className="stat-label">Graduate & Undergrad GPA</div>
                <div className="stat-caption">Summa Cum Laude (NCSU) • ASU MS</div>
                <div className="stat-icon-small">
                  <i className="bi bi-mortarboard-fill"></i>
                </div>
              </Card3DTilt>
            </motion.div>

            <motion.div className="stat-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="stat-card glass-card">
                <div className="stat-number">
                  <CountUp end={8} suffix="+" />
                </div>
                <div className="stat-label">Certifications</div>
                <div className="stat-caption">Full-Stack, ML/AI, Python, C++, Go</div>
                <div className="stat-icon-small">
                  <i className="bi bi-award-fill"></i>
                </div>
              </Card3DTilt>
            </motion.div>

            <motion.div className="stat-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="stat-card glass-card">
                <div className="stat-number">
                  <CountUp end={6} suffix="+" />
                </div>
                <div className="stat-label">Software Projects</div>
                <div className="stat-caption">Distributed Systems, ML & Web</div>
                <div className="stat-icon-small">
                  <i className="bi bi-cpu-fill"></i>
                </div>
              </Card3DTilt>
            </motion.div>

            <motion.div className="stat-card-wrapper" variants={cardVariants}>
              <Card3DTilt className="stat-card glass-card">
                <div className="stat-number">
                  <CountUp end={7} suffix="+" />
                </div>
                <div className="stat-label">Games Developed</div>
                <div className="stat-caption">Godot, Inkle & Interactive Web</div>
                <div className="stat-icon-small">
                  <i className="bi bi-joystick"></i>
                </div>
              </Card3DTilt>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
