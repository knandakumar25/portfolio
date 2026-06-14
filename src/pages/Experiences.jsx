import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkCard from '../components/WorkCard';
import JobSimulationCard from '../components/JobSimulationCard';
import EducationCard from '../components/EducationCard';
import VolunteeringCard from '../components/VolunteeringCard';
import OrganizationCard from '../components/OrganizationCard';

import workData from '../data/work.json';
import jobSimulationsData from '../data/job_simulations.json';
import educationData from '../data/education.json';
import volunteeringData from '../data/volunteering.json';
import organizationsData from '../data/organizations.json';

import '../assets/experiences.css';

// Extract the rightmost year from a duration string for sorting.
const parseEndYear = (duration = '') => {
  if (/[-–]\s*$/.test(duration)) return 9999;
  const years = duration.match(/\d{4}/g);
  return years ? parseInt(years[years.length - 1]) : 0;
};

const tabs = [
  {
    id: 'work',
    label: 'Work Experience',
    icon: 'bi-briefcase-fill',
    data: workData,
    Component: WorkCard,
    sortNameField: 'company',
    filterLabel: 'Skill',
    getFilterValues: item => item.skills || [],
    columns: [
      { label: 'Company',  getValue: item => item.company },
      { label: 'Position', getValue: item => item.position },
      { label: 'Type',     getValue: item => item.type },
      { label: 'Duration', getValue: item => item.duration },
    ]
  },
  {
    id: 'simulations',
    label: 'Job Simulations',
    icon: 'bi-laptop-fill',
    data: jobSimulationsData,
    Component: JobSimulationCard,
    sortNameField: 'company',
    filterLabel: 'Skill',
    getFilterValues: item => item.skills || [],
    columns: [
      { label: 'Company',  getValue: item => item.company },
      { label: 'Position', getValue: item => item.position },
      { label: 'Duration', getValue: item => item.duration },
    ]
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'bi-mortarboard-fill',
    data: educationData,
    Component: EducationCard,
    sortNameField: 'institution',
    filterLabel: 'Skill',
    getFilterValues: item => item.skills || [],
    columns: [
      { label: 'Institution', getValue: item => item.institution },
      { label: 'Degree',      getValue: item => item.degree },
      { label: 'GPA',         getValue: item => item.gpa },
      { label: 'Duration',    getValue: item => item.duration },
    ]
  },
  {
    id: 'volunteering',
    label: 'Volunteering',
    icon: 'bi-people-fill',
    data: volunteeringData,
    Component: VolunteeringCard,
    sortNameField: 'organization',
    filterLabel: 'Cause',
    getFilterValues: item => item.cause ? [item.cause] : [],
    columns: [
      { label: 'Organization', getValue: item => item.organization },
      { label: 'Position',     getValue: item => item.position },
      { label: 'Cause',        getValue: item => item.cause },
      { label: 'Duration',     getValue: item => item.duration },
    ]
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: 'bi-diagram-3-fill',
    data: organizationsData,
    Component: OrganizationCard,
    sortNameField: 'name',
    filterLabel: 'School',
    getFilterValues: item => item.school ? [item.school] : [],
    columns: [
      { label: 'Name',     getValue: item => item.name },
      { label: 'Role',     getValue: item => item.role },
      { label: 'School',   getValue: item => item.school },
      { label: 'Duration', getValue: item => item.duration },
    ]
  }
];

const Experiences = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
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

  const tabSelectorStyle = {
    textAlign: 'center',
    direction: 'ltr',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  // Reset controls whenever the active tab changes
  useEffect(() => {
    setSearchQuery('');
    setActiveFilter('');
    setSortOrder('default');
  }, [activeTab]);

  // Collect unique filter values for the current tab (sorted A-Z)
  const filterOptions = useMemo(() => {
    const values = new Set();
    activeTabData.data.forEach(item =>
      activeTabData.getFilterValues(item).forEach(v => values.add(v))
    );
    return Array.from(values).sort();
  }, [activeTabData]);

  // Apply search, filter, and sort
  const displayData = useMemo(() => {
    let data = [...activeTabData.data];

    // Text search across all fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item =>
        activeTabData.columns.some(col =>
          String(col.getValue(item) || '').toLowerCase().includes(q)
        )
      );
    }

    // Exact-match filter
    if (activeFilter) {
      data = data.filter(item =>
        activeTabData.getFilterValues(item).includes(activeFilter)
      );
    }

    // Sort
    if (sortOrder === 'name-asc') {
      data.sort((a, b) =>
        String(a[activeTabData.sortNameField] || '').localeCompare(String(b[activeTabData.sortNameField] || ''))
      );
    } else if (sortOrder === 'name-desc') {
      data.sort((a, b) =>
        String(b[activeTabData.sortNameField] || '').localeCompare(String(a[activeTabData.sortNameField] || ''))
      );
    } else if (sortOrder === 'recent') {
      data.sort((a, b) => parseEndYear(b.duration) - parseEndYear(a.duration));
    } else if (sortOrder === 'oldest') {
      data.sort((a, b) => parseEndYear(a.duration) - parseEndYear(b.duration));
    } else {
      // Default: sort by recent
      data.sort((a, b) => parseEndYear(b.duration) - parseEndYear(a.duration));
    }

    return data;
  }, [activeTabData, searchQuery, activeFilter, sortOrder]);

  return (
    <div className="experiences-container">
      {/* Hero Section */}
      <div className="experiences-hero">
        <motion.div
          className="container text-center rtl-center-protect"
          style={centerAlignStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={centerTextOnly}>My Journey</h1>
          <p className="hero-subtitle rtl-center-protect" style={centerTextOnly}>
            A technical breakdown of my journey through software engineering, academics, and leadership.
          </p>
          <div className="hero-divider" style={centerAlignStyle}></div>
        </motion.div>
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
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="experiences-content">
        <div className="container">
          {/* Controls */}
          <div className="exp-controls">
            <div className="exp-search-wrap">
              <i className="bi bi-search exp-search-icon"></i>
              <input
                className="exp-search"
                type="text"
                placeholder="Search journey..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="exp-clear-btn" onClick={() => setSearchQuery('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            <select
              className="exp-select"
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
            >
              <option value="">All {activeTabData.filterLabel}s</option>
              {filterOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="exp-select"
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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="timeline-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Timeline Vertical Line */}
              {displayData.length > 0 && <div className="timeline-line"></div>}

              {displayData.length === 0 ? (
                <div className="exp-no-results">
                  <i className="bi bi-search"></i>
                  <span>No results match your search or filter.</span>
                </div>
              ) : (
                displayData.map((item, index) => {
                  const orgName = item.company || item.institution || item.organization || item.name;
                  const subTitle = item.position || item.degree || item.role;
                  const duration = item.duration;
                  const bulletPoints = item.responsibilities || item.activities || item.societies || [];
                  const skills = item.skills || [];

                  const isLeft = index % 2 === 0;

                  return (
                    <motion.div
                      key={item.id}
                      className="timeline-item"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
                    >
                      {/* Timeline Dot */}
                      <div className="timeline-dot-container">
                        <div className="timeline-dot"></div>
                      </div>

                      {/* Left Side */}
                      {isLeft ? (
                        /* Meta Info on the left */
                        <div className="timeline-meta-col align-right md:order-1">
                          <span className="timeline-date-badge">{duration}</span>
                          <h3 className="timeline-main-title">{subTitle}</h3>
                          <p className="timeline-sub-title">{orgName}</p>
                        </div>
                      ) : (
                        /* Card on the left */
                        <div className="timeline-card-col md:order-1">
                          <div className="timeline-card glass-card">
                            <div className="timeline-card-header">
                              <div className="timeline-card-icon-wrap">
                                <i className={`bi ${activeTabData.icon}`}></i>
                              </div>
                              <h3 className="timeline-org-name">{orgName}</h3>
                            </div>
                            {/* Bullets preview */}
                            {bulletPoints.length > 0 && (
                              <ul className="timeline-bullets">
                                {bulletPoints.slice(0, 2).map((pt, ptIdx) => (
                                  <li key={ptIdx} className="timeline-bullet-item">
                                    <span className="timeline-bullet-dot">•</span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {/* Skills preview */}
                            {skills.length > 0 && (
                              <div className="timeline-tags">
                                {skills.slice(0, 3).map((s, sIdx) => (
                                  <span key={sIdx} className="timeline-tag">{s}</span>
                                ))}
                                {skills.length > 3 && (
                                  <span className="timeline-tag">+{skills.length - 3}</span>
                                )}
                              </div>
                            )}
                            <button
                              className="timeline-details-btn"
                              onClick={() => setSelectedItem({ item, tab: activeTabData })}
                            >
                              View Details <i className="bi bi-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Right Side */}
                      {isLeft ? (
                        /* Card on the right */
                        <div className="timeline-card-col md:order-2">
                          <div className="timeline-card glass-card">
                            <div className="timeline-card-header">
                              <div className="timeline-card-icon-wrap">
                                <i className={`bi ${activeTabData.icon}`}></i>
                              </div>
                              <h3 className="timeline-org-name">{orgName}</h3>
                            </div>
                            {/* Bullets preview */}
                            {bulletPoints.length > 0 && (
                              <ul className="timeline-bullets">
                                {bulletPoints.slice(0, 2).map((pt, ptIdx) => (
                                  <li key={ptIdx} className="timeline-bullet-item">
                                    <span className="timeline-bullet-dot">•</span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {/* Skills preview */}
                            {skills.length > 0 && (
                              <div className="timeline-tags">
                                {skills.slice(0, 3).map((s, sIdx) => (
                                  <span key={sIdx} className="timeline-tag">{s}</span>
                                ))}
                                {skills.length > 3 && (
                                  <span className="timeline-tag">+{skills.length - 3}</span>
                                )}
                              </div>
                            )}
                            <button
                              className="timeline-details-btn"
                              onClick={() => setSelectedItem({ item, tab: activeTabData })}
                            >
                              View Details <i className="bi bi-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Meta Info on the right */
                        <div className="timeline-meta-col align-left md:order-2">
                          <span className="timeline-date-badge">{duration}</span>
                          <h3 className="timeline-main-title">{subTitle}</h3>
                          <p className="timeline-sub-title">{orgName}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="exp-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              className="exp-modal"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <button className="exp-modal-close" onClick={() => setSelectedItem(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
              <selectedItem.tab.Component {...{ [selectedItem.tab.id]: selectedItem.item }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Experiences;
