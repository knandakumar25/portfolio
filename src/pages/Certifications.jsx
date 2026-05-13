import React, { useState, useMemo } from 'react';
import CertificationCard from '../components/CertificationCard';
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
  const [selectedCert, setSelectedCert] = useState(null);
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

    // Exact skill match
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

  return (
    <div className="certifications-container">
      {/* Hero Section */}
      <div className="certifications-hero">
        <div className="container text-center" style={sectionCenterStyle}>
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={textCenterOnly}>Certifications</h1>
          <p className="hero-subtitle rtl-center-protect" style={textCenterOnly}>Professional achievements and continuous learning</p>
          <div className="hero-divider" style={sectionCenterStyle}></div>
        </div>
      </div>

      {/* Certifications Table Section */}
      <section className="certifications-section">
        <div className="container">

          {/* Controls */}
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

          {/* Table */}
          <div className="cert-table">
            <div className="cert-table-header">
              <div className="cert-table-th">Title</div>
              <div className="cert-table-th">Issuer</div>
              <div className="cert-table-th">Date Issued</div>
              <div className="cert-table-th cert-table-th--action"></div>
            </div>

            {displayData.length === 0 ? (
              <div className="cert-no-results">
                <i className="bi bi-search"></i>
                <span>No certifications match your search or filter.</span>
              </div>
            ) : (
              displayData.map(cert => (
                <div key={cert.id} className="cert-table-row">
                  <div className="cert-table-td cert-table-title">{cert.title}</div>
                  <div className="cert-table-td">{cert.issuer}</div>
                  <div className="cert-table-td">{cert.dateIssued}</div>
                  <div className="cert-table-td cert-table-td--action">
                    <button
                      className="cert-details-btn"
                      onClick={() => setSelectedCert(cert)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedCert && (
        <div className="cert-modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal" onClick={e => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <CertificationCard certification={selectedCert} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
