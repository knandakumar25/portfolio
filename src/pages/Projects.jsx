import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftwareCard from '../components/SoftwareCard';

import softwareProjectsData from '../data/software_projects.json';
import gameProjectsData from '../data/game_projects.json';

import '../assets/projects.css';

const parseEndYear = (duration = '') => {
  if (/[-–]\s*$/.test(duration)) return 9999;
  const years = duration.match(/\d{4}/g);
  return years ? parseInt(years[years.length - 1]) : 0;
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

    // Exact skill filter (prevents "Java" matching "JavaScript")
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

      {/* Projects Table Section */}
      <section className="proj-content">
        <div className="container">

          {/* Controls */}
          <div className="proj-controls">
            <div className="proj-search-wrap">
              <i className="bi bi-search proj-search-icon"></i>
              <input
                className="proj-search"
                type="text"
                placeholder="Search…"
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

          {/* Table */}
          <div className="proj-table">
            <div className="proj-table-header">
              <div className="proj-table-th">Title</div>
              <div className="proj-table-th">Type</div>
              <div className="proj-table-th">Duration</div>
              <div className="proj-table-th proj-table-th--action"></div>
            </div>

            {displayData.length === 0 ? (
              <div className="proj-no-results">
                <i className="bi bi-search"></i>
                <span>No projects match your search or filter.</span>
              </div>
            ) : (
              displayData.map(project => (
                <div key={`${project.type}-${project.id}`} className="proj-table-row">
                  <div className="proj-table-td proj-title">
                    {project.title}
                    {project.category && (
                      <span className="proj-category-badge">{project.category}</span>
                    )}
                  </div>
                  <div className="proj-table-td">
                    <span className={`proj-type-badge proj-type-badge--${project.type.toLowerCase()}`}>
                      <i className={`bi ${project.type === 'Software' ? 'bi-code-slash' : 'bi-joystick'}`}></i>
                      {project.type}
                    </span>
                  </div>
                  <div className="proj-table-td">{project.duration}</div>
                  <div className="proj-table-td proj-table-td--action">
                    <button
                      className="proj-details-btn"
                      onClick={() => handleDetails(project)}
                    >
                      {project.type === 'Game' ? (
                        <><i className="bi bi-arrow-up-right-square"></i> View</>
                      ) : (
                        'Details'
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Software Project Modal */}
      {selectedProject && (
        <div className="proj-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="proj-modal" onClick={e => e.stopPropagation()}>
            <button className="proj-modal-close" onClick={() => setSelectedProject(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <SoftwareCard project={selectedProject} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
