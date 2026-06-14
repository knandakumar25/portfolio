import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DataSheet from '../components/Modules/DataSheet';
import certificationsData from '../data/certifications.json';
import '../assets/certifications.css';

const MONTHS = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

const parseDateValue = (dateStr = '') => {
  const parts = dateStr.trim().split(' ');
  const month = MONTHS[parts[0]] || 0;
  const year = parseInt(parts[1]) || 0;
  return year * 100 + month;
};

const Certifications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [issuerFilter, setIssuerFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const sectionCenterStyle = {
    direction: 'ltr',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const textCenterOnly = {
    textAlign: 'center',
    direction: 'ltr'
  };

  const skillOptions = useMemo(() => {
    const values = new Set();
    certificationsData.forEach(c => (c.skills || []).forEach(s => values.add(s)));
    return Array.from(values).sort();
  }, []);

  const issuerOptions = useMemo(() => {
    const values = new Set(certificationsData.map(c => c.issuer).filter(Boolean));
    return Array.from(values).sort();
  }, []);

  const displayData = useMemo(() => {
    let data = [...certificationsData];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(c =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.issuer || '').toLowerCase().includes(q)
      );
    }

    if (issuerFilter) {
      data = data.filter(c => c.issuer === issuerFilter);
    }

    if (skillFilter) {
      data = data.filter(c => (c.skills || []).includes(skillFilter));
    }

    if (sortOrder === 'name-asc') {
      data.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortOrder === 'name-desc') {
      data.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (sortOrder === 'recent') {
      data.sort((a, b) => parseDateValue(b.dateIssued) - parseDateValue(a.dateIssued));
    } else if (sortOrder === 'oldest') {
      data.sort((a, b) => parseDateValue(a.dateIssued) - parseDateValue(b.dateIssued));
    }

    return data;
  }, [searchQuery, skillFilter, issuerFilter, sortOrder]);

  const renderCertDetails = (cert) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontWeight: 'bold', color: 'var(--os-accent)', fontSize: '0.75rem', marginBottom: '4px' }}>
        {`> ISSUER: ${cert.issuer}`}
      </div>
      {cert.credentialId && (
        <div style={{ opacity: 0.8, marginBottom: '8px' }}>
          {`> CREDENTIAL_ID: ${cert.credentialId}`}
        </div>
      )}
      {cert.link && (
        <div style={{ marginTop: '8px' }}>
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--os-accent)',
              textDecoration: 'none',
              fontSize: '0.7rem',
              border: '1px solid var(--os-accent)',
              padding: '2px 6px',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            VIEW_CERTIFICATE <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.6rem' }}></i>
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="certifications-container">
      <div className="certifications-hero">
        <motion.div
          className="container text-center"
          style={sectionCenterStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={textCenterOnly}>Certifications</h1>
          <p className="hero-subtitle rtl-center-protect" style={textCenterOnly}>Professional achievements and continuous learning</p>
          <div className="hero-divider" style={sectionCenterStyle}></div>
        </motion.div>
      </div>

      <section className="certifications-section">
        <div className="container">
          <div className="cert-controls">
            <div className="cert-search-wrap">
              <i className="bi bi-search cert-search-icon"></i>
              <input
                className="cert-search"
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="cert-clear-btn" onClick={() => setSearchQuery('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>

            <select
              className="cert-select"
              value={issuerFilter}
              onChange={e => setIssuerFilter(e.target.value)}
            >
              <option value="">All Issuers</option>
              {issuerOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="cert-select"
              value={skillFilter}
              onChange={e => setSkillFilter(e.target.value)}
            >
              <option value="">All Skills</option>
              {skillOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select
              className="cert-select"
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

          <DataSheet
            data={displayData}
            idPrefix="CERT"
            titleField="title"
            dateField="dateIssued"
            renderDetails={renderCertDetails}
          />
        </div>
      </section>
    </div>
  );
};

export default Certifications;
