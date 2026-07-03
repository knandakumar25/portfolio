import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataSheet from '../components/Modules/DataSheet';

import workData from '../data/work.json';
import jobSimulationsData from '../data/job_simulations.json';
import educationData from '../data/education.json';
import volunteeringData from '../data/volunteering.json';
import organizationsData from '../data/organizations.json';
import { centerAlignStyle, centerTextOnly } from '../styles/commonStyles';

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
    sortNameField: 'company',
    filterLabel: 'Skill',
    getFilterValues: item => item.skills || [],
    titleField: 'company',
    dateField: 'duration',
    renderDetails: (item) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--os-accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
          {`> POSITION: ${item.position}`}
        </div>
        <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
          {item.responsibilities.map((resp, i) => (
            <div key={i} style={{ marginBottom: '2px' }}>{`> ${resp}`}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'simulations',
    label: 'Job Simulations',
    icon: 'bi-laptop-fill',
    data: jobSimulationsData,
    sortNameField: 'company',
    filterLabel: 'Skill',
    getFilterValues: item => item.skills || [],
    titleField: 'company',
    dateField: 'duration',
    renderDetails: (item) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--os-accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
          {`> POSITION: ${item.position}`}
        </div>
        <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
          {item.responsibilities.map((resp, i) => (
            <div key={i} style={{ marginBottom: '2px' }}>{`> ${resp}`}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'bi-mortarboard-fill',
    data: educationData,
    sortNameField: 'institution',
    filterLabel: 'Skill',
    getFilterValues: item => item.skills || [],
    titleField: 'institution',
    dateField: 'duration',
    renderDetails: (item) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--os-accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
          {`> DEGREE: ${item.degree}`}
        </div>
        <div style={{ opacity: 0.8, marginBottom: '8px' }}>
          {`> GPA: ${item.gpa}`}
        </div>
        {item.societies && item.societies.length > 0 && (
          <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--os-text-muted)', marginBottom: '4px' }}>
              {`> SOCIETIES: `}
            </div>
            {item.societies.map((soc, i) => (
              <div key={i} style={{ marginBottom: '2px' }}>{`> ${soc}`}</div>
            ))}
          </div>
        )}
      </div>
    )
  },
  {
    id: 'volunteering',
    label: 'Volunteering',
    icon: 'bi-people-fill',
    data: volunteeringData,
    sortNameField: 'organization',
    filterLabel: 'Cause',
    getFilterValues: item => item.cause ? [item.cause] : [],
    titleField: 'organization',
    dateField: 'duration',
    renderDetails: (item) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--os-accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
          {`> POSITION: ${item.position}`}
        </div>
        <div style={{ opacity: 0.8, marginBottom: '8px' }}>
          {`> CAUSE: ${item.cause}`}
        </div>
        <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
          {item.responsibilities.map((resp, i) => (
            <div key={i} style={{ marginBottom: '2px' }}>{`> ${resp}`}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: 'bi-diagram-3-fill',
    data: organizationsData,
    sortNameField: 'name',
    filterLabel: 'School',
    getFilterValues: item => item.school ? [item.school] : [],
    titleField: 'name',
    dateField: 'duration',
    renderDetails: (item) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--os-accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
          {`> SCHOOL: ${item.school}`}
        </div>
        <div style={{ opacity: 0.8, marginBottom: '8px' }}>
          {`> ROLE: ${item.role}`}
        </div>
        <div style={{ opacity: 0.8, lineHeight: '1.6' }}>
          {item.activities.map((act, i) => (
            <div key={i} style={{ marginBottom: '2px' }}>{`> ${act}`}</div>
          ))}
        </div>
      </div>
    )
  }
];

const Experiences = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const tabSelectorStyle = {
    textAlign: 'center',
    direction: 'ltr',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  useEffect(() => {
    setSearchQuery('');
    setActiveFilter('');
    setSortOrder('default');
  }, [activeTab]);

  const filterOptions = useMemo(() => {
    const values = new Set();
    activeTabData.data.forEach(item =>
      activeTabData.getFilterValues(item).forEach(v => values.add(v))
    );
    return Array.from(values).sort();
  }, [activeTabData]);

  const displayData = useMemo(() => {
    let data = [...activeTabData.data];

    // Text search across all fields
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item =>
        Object.values(item).some(val =>
          String(val || '').toLowerCase().includes(q)
        )
      );
    }

    // Exact-match filter
    if (activeFilter) {
      data = data.filter(item =>
        activeTabData.getFilterValues(item).includes(activeFilter)
      );
    }

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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <DataSheet
                data={displayData}
                idPrefix="EXP"
                titleField={activeTabData.titleField}
                dateField={activeTabData.dateField}
                renderDetails={activeTabData.renderDetails}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Experiences;
