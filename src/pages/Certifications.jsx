import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CertificationCard from '../components/CertificationCard';
import certificationsData from '../data/certifications.json';
import '../assets/certifications.css';
import { centerAlignStyle, centerTextOnly, sectionCenterStyle, textCenterOnly } from '../styles/commonStyles';

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

const getCertificationIcon = (title = '', issuer = '') => {
  const t = title.toLowerCase();
  if (t.includes('aws') || t.includes('cloud') || t.includes('kubernetes') || t.includes('ckad')) {
    return 'bi bi-cloud-fill';
  }
  if (t.includes('python') || t.includes('go') || t.includes('c++') || t.includes('c#') || t.includes('php') || t.includes('kotlin') || t.includes('java') || t.includes('programming') || t.includes('codecademy') || t.includes('engineer')) {
    return 'bi bi-code-slash';
  }
  if (t.includes('ai') || t.includes('artificial intelligence') || t.includes('machine learning') || t.includes('deep learning') || t.includes('claude') || t.includes('figma')) {
    return 'bi bi-cpu-fill';
  }
  if (t.includes('security') || t.includes('cybersecurity')) {
    return 'bi bi-shield-lock-fill';
  }
  if (t.includes('excel') || t.includes('access') || t.includes('data') || t.includes('sql') || t.includes('postgres')) {
    return 'bi bi-database-fill';
  }
  return 'bi bi-award-fill';
};

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [issuerFilter, setIssuerFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const skillOptions = useMemo(() => {
    const values = new Set();
    certificationsData.forEach(c => (c.skills || []).forEach(s => values.add(s)));
    return Array.from(values).sort();
  }, []);

  const issuerOptions = useMemo(() => {
    const values = new Set(certificationsData.map(c => c.issuer).filter(Boolean));
    return Array.from(values).sort();
  }, []);

  // Sort and filter all certifications
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
    } else {
      // Default: Sort by date issued descending (most recent first)
      data.sort((a, b) => parseDateValue(b.dateIssued) - parseDateValue(a.dateIssued));
    }

    return data;
  }, [searchQuery, skillFilter, issuerFilter, sortOrder]);

  // Check if any filter or search query is active
  const isFiltered = useMemo(() => {
    return searchQuery.trim() !== '' || issuerFilter !== '' || skillFilter !== '' || sortOrder !== 'default';
  }, [searchQuery, issuerFilter, skillFilter, sortOrder]);

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="certifications-container">
      {/* Hero Section */}
      <div className="certifications-hero">
        <motion.div
          className="container text-center rtl-center-protect"
          style={sectionCenterStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="hero-title anek-devanagari-font rtl-center-protect" style={textCenterOnly}>Certifications &amp; Licenses</h1>
          <p className="hero-subtitle rtl-center-protect" style={textCenterOnly}>
            A curated collection of professional qualifications, technical specializations, and industry-standard licenses documenting my continuous learning journey.
          </p>
          <div className="hero-divider" style={sectionCenterStyle}></div>
        </motion.div>
      </div>

      {/* Certifications Section */}
      <section className="certifications-section">
        <div className="container">
          {/* Controls */}
          <div className="cert-controls">
            <div className="cert-search-wrap">
              <i className="bi bi-search cert-search-icon"></i>
              <input
                className="cert-search"
                type="text"
                placeholder="Search certifications..."
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

          {displayData.length === 0 ? (
            <div className="cert-no-results">
              <i className="bi bi-search"></i>
              <span>No certifications match your search or filter.</span>
            </div>
          ) : isFiltered ? (
            /* Fallback Grid View when filter/search is active */
            <motion.div
              className="fallback-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {displayData.map((cert) => (
                <motion.div
                  key={cert.id}
                  className="bento-card-grid glass-card"
                  variants={itemAnim}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div>
                    <div className="bento-card-grid-header">
                      <i className={`${getCertificationIcon(cert.title, cert.issuer)} bento-card-icon`}></i>
                      <span className="bento-card-date">{cert.dateIssued}</span>
                    </div>
                    <h3 className="bento-card-title">{cert.title}</h3>
                    <p className="bento-card-issuer">{cert.issuer}</p>
                  </div>
                  <div>
                    {cert.credentialId && (
                      <div className="bento-card-id-block mb-3">
                        <span className="bento-meta-label">Credential ID</span>
                        <span className="bento-meta-value-mono">{cert.credentialId}</span>
                      </div>
                    )}
                    <button
                      className="verify-btn w-100"
                      onClick={() => setSelectedCert(cert)}
                    >
                      Details <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Premium Bento Grid View (Unfiltered Default view) */
            <motion.div
              className="bento-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Featured Certification (Large Card) - displayData[0] */}
              {displayData[0] && (
                <motion.div
                  className="bento-card-featured glass-card"
                  variants={itemAnim}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <i className="bi bi-patch-check-fill absolute -bottom-6 -right-6 text-[180px] opacity-[0.03] pointer-events-none"></i>
                  <div>
                    <span className="featured-badge">MOST RECENT</span>
                    <h2 className="featured-title">{displayData[0].title}</h2>
                    <p className="featured-issuer">{displayData[0].issuer}</p>
                  </div>
                  <div className="bento-featured-footer">
                    <div>
                      <p className="bento-meta-label">Issue Date</p>
                      <p className="bento-meta-value">{displayData[0].dateIssued}</p>
                    </div>
                    <div>
                      <p className="bento-meta-label">Credential ID</p>
                      <p className="bento-meta-value-mono">{displayData[0].credentialId || 'N/A'}</p>
                    </div>
                    <div>
                      <button
                        className="verify-btn w-100"
                        onClick={() => setSelectedCert(displayData[0])}
                      >
                        Verify Credential <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Side Card (Stats Focus) */}
              <motion.div
                className="bento-card-stats glass-card"
                variants={itemAnim}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="stats-circle">
                  <i className="bi bi-award-fill"></i>
                </div>
                <div className="stats-number-huge">{certificationsData.length}+</div>
                <p className="stats-label-mono">ACTIVE CREDENTIALS</p>
                <div className="stats-quote-divider">
                  <p className="stats-quote-text">
                    "Commitment to excellence through verifiable domain expertise across the full stack."
                  </p>
                </div>
              </motion.div>

              {/* Medium Grid Cards (Next 3 certs) - displayData[1, 2, 3] */}
              {displayData.slice(1, 4).map((cert) => (
                <motion.div
                  key={cert.id}
                  className="bento-card-grid glass-card"
                  variants={itemAnim}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div>
                    <div className="bento-card-grid-header">
                      <i className={`${getCertificationIcon(cert.title, cert.issuer)} bento-card-icon`}></i>
                      <span className="bento-card-date">{cert.dateIssued}</span>
                    </div>
                    <h3 className="bento-card-title">{cert.title}</h3>
                    <p className="bento-card-issuer">{cert.issuer}</p>
                  </div>
                  <div>
                    {cert.credentialId && (
                      <div className="bento-card-id-block mb-3">
                        <span className="bento-meta-label">Credential ID</span>
                        <span className="bento-meta-value-mono">{cert.credentialId}</span>
                      </div>
                    )}
                    <button
                      className="verify-btn w-100"
                      onClick={() => setSelectedCert(cert)}
                    >
                      Details <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* List Layout for remaining Certifications - displayData.slice(4) */}
              {displayData.length > 4 && (
                <>
                  <div className="additional-title-section">
                    <h3 className="additional-title-mono">
                      <i className="bi bi-list-task"></i>
                      ADDITIONAL QUALIFICATIONS
                    </h3>
                  </div>
                  <div className="additional-list-container">
                    {displayData.slice(4).map((cert, index) => (
                      <motion.div
                        key={cert.id}
                        className="additional-list-item glass-card"
                        variants={itemAnim}
                        whileHover={{ x: 6, transition: { duration: 0.2 } }}
                      >
                        <div className="additional-item-left">
                          <div className="additional-item-icon">
                            <i className={getCertificationIcon(cert.title, cert.issuer)}></i>
                          </div>
                          <div>
                            <h4 className="additional-item-title">{cert.title}</h4>
                            <p className="additional-item-issuer">{cert.issuer}</p>
                          </div>
                        </div>
                        <div className="additional-item-right">
                          <div className="additional-meta-item">
                            <span className="bento-meta-label">DATE</span>
                            <span className="bento-meta-value">{cert.dateIssued}</span>
                          </div>
                          {cert.credentialId && (
                            <div className="additional-meta-item">
                              <span className="bento-meta-label">ID</span>
                              <span className="bento-meta-value-mono">{cert.credentialId}</span>
                            </div>
                          )}
                          <div>
                            <button
                              className="additional-view-btn"
                              onClick={() => setSelectedCert(cert)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="cert-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="cert-modal"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
              <CertificationCard certification={selectedCert} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Certifications;
