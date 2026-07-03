import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SoftwareCard from '../components/SoftwareCard';

import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';

import '../assets/projects.css';
import { centerAlignStyle, centerTextOnly } from '../styles/commonStyles';

const parseEndYear = (duration = '') => {
  if (/[-–]\s*$/.test(duration)) return 9999;
  const years = duration.match(/\d{4}/g);
  return years ? parseInt(years[years.length - 1]) : 0;
};

const getProjectIcon = (project) => {
  if (project.type === 'Game') return 'bi-joystick';
  const title = (project.title || '').toLowerCase();
  if (title.includes('router') || title.includes('nexus')) return 'bi-router';
  if (title.includes('gesture') || title.includes('home')) return 'bi-house-gear';
  if (title.includes('ai') || title.includes('opponent')) return 'bi-cpu';
  if (title.includes('cafe')) return 'bi-cup-hot';
  if (title.includes('sustainability')) return 'bi-globe-americas';
  if (title.includes('vacuum')) return 'bi-robot';
  if (title.includes('tickets')) return 'bi-ticket-detailed';
  return 'bi-code-slash';
};

const getPlaceholderGradient = (id) => {
  const gradients = [
    'linear-gradient(135deg, #1e3a8a 0%, #0b1326 100%)', // Blue/Navy
    'linear-gradient(135deg, #064e3b 0%, #0b1326 100%)', // Green/Navy
    'linear-gradient(135deg, #581c87 0%, #060e20 100%)', // Purple/Navy
    'linear-gradient(135deg, #7c2d12 0%, #0b1326 100%)', // Orange/Navy
    'linear-gradient(135deg, #831843 0%, #0b1326 100%)', // Pink/Navy
    'linear-gradient(135deg, #115e59 0%, #060e20 100%)', // Teal/Navy
  ];
  return gradients[id % gradients.length];
};

// Combine both datasets with a type tag
const allProjects = [
  ...softwareProjectsData.map(p => ({ ...p, type: 'Software' })),
  ...gameProjectsData.map(g => ({ ...g, type: 'Game' })),
];

const Projects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  // All unique skills across every project, sorted A-Z
  const skillOptions = useMemo(() => {
    const values = new Set();
    allProjects.forEach(p => (p.skills || []).forEach(s => values.add(s)));
    return Array.from(values).sort();
  }, []);

  // All unique categories from software projects
  const categoryOptions = useMemo(() => {
    const values = new Set();
    allProjects.forEach(p => { if (p.category) values.add(p.category); });
    return Array.from(values).sort();
  }, []);

  const displayData = useMemo(() => {
    let data = [...allProjects];

    // Text search across title + description fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter) {
      data = data.filter(p => p.type === typeFilter);
    }

    // Category filter
    if (categoryFilter) {
      data = data.filter(p => p.category === categoryFilter);
    }

    // Exact skill filter
    if (skillFilter) {
      data = data.filter(p => (p.skills || []).includes(skillFilter));
    }

    // Sort
    if (sortOrder === 'name-asc') {
      data.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortOrder === 'name-desc') {
      data.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (sortOrder === 'recent') {
      data.sort((a, b) => parseEndYear(b.duration) - parseEndYear(a.duration));
    } else if (sortOrder === 'oldest') {
      data.sort((a, b) => parseEndYear(a.duration) - parseEndYear(b.duration));
    } else {
      // Default: sort by recent
      data.sort((a, b) => parseEndYear(b.duration) - parseEndYear(a.duration));
    }

    return data;
  }, [searchQuery, typeFilter, categoryFilter, skillFilter, sortOrder]);

  const handleDetails = (project) => {
    if (project.type === 'Game') {
      const urlFriendlyTitle = project.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      navigate(`/game/${urlFriendlyTitle}`);
    } else {
      setSelectedProject(project);
    }
  };

  // Stagger variants for grid load
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="projects-container">
      {/* Hero Section */}
      <div className="projects-hero">
        <motion.div
          className="container text-center rtl-center-protect"
          style={centerAlignStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>My Projects</h1>
          <p className="hero-subtitle rtl-center-protect" style={centerTextOnly}>
            A showcase of technical explorations, full-stack applications, and experimental game designs built using modern ecosystems.
          </p>
          <div className="hero-divider rtl-center-protect" style={centerAlignStyle}></div>
        </motion.div>
      </div>

      {/* Projects Grid Section */}
      <section className="proj-content">
        <div className="container">
          {/* Controls */}
          <div className="proj-controls">
            <div className="proj-search-wrap">
              <i className="bi bi-search proj-search-icon"></i>
              <input
                className="proj-search"
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="proj-clear-btn" onClick={() => setSearchQuery('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            <select
              className="proj-select"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Software">Software</option>
              <option value="Game">Game</option>
            </select>

            {categoryOptions.length > 0 && (
              <select
                className="proj-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            <select
              className="proj-select"
              value={skillFilter}
              onChange={e => setSkillFilter(e.target.value)}
            >
              <option value="">All Skills</option>
              {skillOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="proj-select"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="name-asc">Name A → Z</option>
              <option value="name-desc">Name Z → A</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {displayData.length === 0 ? (
            <div className="proj-no-results">
              <i className="bi bi-search"></i>
              <span>No projects match your search or filter.</span>
            </div>
          ) : (
            <motion.div
              className="projects-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {displayData.map((project) => (
                <motion.div
                  key={`${project.type}-${project.id}`}
                  className="project-grid-card glass-card"
                  variants={itemAnim}
                >
                  {/* Image or Themed Gradient cover */}
                  <div className="project-card-image-wrap">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="project-card-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="project-card-placeholder"
                        style={{ background: getPlaceholderGradient(project.id) }}
                      >
                        <i className={`bi ${getProjectIcon(project)} project-card-placeholder-icon`}></i>
                      </div>
                    )}
                    <div className="project-image-overlay">
                      <span className="project-overlay-text">
                        {project.type === 'Game' ? 'LAUNCH EXPERIENCE' : 'VIEW CASE STUDY'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="project-card-body">
                    {/* Tags */}
                    {project.skills && project.skills.length > 0 && (
                      <div className="project-tags-wrap">
                        {project.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="project-tag">
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 3 && (
                          <span className="project-tag">+{project.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="project-card-title">
                      {project.title}
                      {project.category && (
                        <span className="project-cat-badge">{project.category}</span>
                      )}
                    </h3>

                    {/* Description */}
                    <p className="project-card-desc line-clamp-3">
                      {project.shortDescription || project.description}
                    </p>

                    {/* Card Footer */}
                    <div className="project-card-footer">
                      <button
                        className="project-btn-details"
                        onClick={() => handleDetails(project)}
                      >
                        {project.type === 'Game' ? 'Launch Game' : 'View Details'}{' '}
                        <i className="bi bi-arrow-right"></i>
                      </button>
                      <i className={`bi ${project.type === 'Game' ? 'bi-joystick' : 'bi-code-slash'} project-type-indicator-icon`}></i>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Software Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="proj-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="proj-modal"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <button className="proj-modal-close" onClick={() => setSelectedProject(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
              <SoftwareCard project={selectedProject} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
