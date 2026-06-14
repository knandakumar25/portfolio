import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Clock,
  ExternalLink,
  Download,
  Globe
} from 'lucide-react';

const ProjectMatrix = ({ softwareProjects, gameProjects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = [
    ...softwareProjects.map(p => ({ ...p, type: 'Software' })),
    ...gameProjects.map(g => ({ ...g, type: 'Game' })),
  ];

  const getProjectStatus = (duration) => {
    if (!duration) return 'UNKNOWN';
    return duration.toLowerCase().includes('present') ? 'IN_PROGRESS' : 'COMPLETED';
  };

  const generateDevLog = (project) => {
    const milestones = [
      { timestamp: 'T-0', event: 'Project initialization and requirements gathering' },
      { timestamp: 'T+1', event: 'Core architecture design and prototype development' },
      { timestamp: 'T+2', event: 'Primary feature implementation and integration' },
      { timestamp: 'T+3', event: 'Testing, debugging, and performance optimization' },
      { timestamp: 'T+FINAL', event: 'Project deployment and final documentation' },
    ];
    return milestones;
  };

  return (
    <div className="project-matrix-container" style={{
      backgroundColor: 'var(--os-bg)',
      color: 'var(--os-text)',
      fontFamily: 'var(--os-font-mono)',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      {/* Matrix Grid */}
      <div className="matrix-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {allProjects.map((project, idx) => (
          <motion.div
            key={`${project.type}-${project.id}`}
            className="matrix-item"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedProject(project)}
            style={{
              cursor: 'pointer',
              position: 'relative',
              textAlign: 'center',
              padding: '1rem',
              border: '1px solid var(--os-grid)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '4px'
            }}
          >
            <div className="matrix-icon" style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              backgroundColor: 'var(--os-grid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              border: '1px solid var(--os-accent)',
              overflow: 'hidden'
            }}>
              {project.image ? (
                <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Terminal size={32} color="var(--os-accent)" />
              )}
            </div>
            <div className="matrix-title" style={{
              fontSize: '0.8rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {project.title}
            </div>

            {/* Hover Preview */}
            <motion.div
              className="matrix-preview"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'var(--os-glass)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0.5rem',
                fontSize: '0.7rem',
                zIndex: 10,
                pointerEvents: 'none',
                borderRadius: '4px'
              }}
            >
              <div style={{ color: 'var(--os-accent)', marginBottom: '0.25rem' }}>SYSTEM_PREVIEW</div>
              <div>{project.shortDescription || project.description.substring(0, 60) + '...'}</div>
              <div style={{ marginTop: '0.5rem', color: 'var(--os-text-muted)' }}>
                STACK: {project.skills?.[0] || 'N/A'}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Deep Dive Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="deep-dive-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'var(--os-glass)',
              backdropFilter: 'blur(12px)',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem'
            }}
          >
            <motion.div
              className="deep-dive-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                width: '100%',
                maxWidth: '1400px',
                height: '90vh',
                backgroundColor: 'var(--os-bg)',
                border: '2px solid var(--os-accent)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1px',
                backgroundColor: 'var(--os-accent)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: 1100,
                  backgroundColor: 'var(--os-accent)',
                  color: 'var(--os-bg)',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--os-font-mono)',
                  fontWeight: 'bold',
                  fontSize: '0.8rem'
                }}
              >
                [ CLOSE_MODULE ]
              </button>

              {/* Left Column: Technical Specs */}
              <div className="dive-col" style={{
                backgroundColor: 'var(--os-bg)',
                padding: '2rem',
                borderRight: '1px solid var(--os-accent)',
                overflowY: 'auto'
              }}>
                <div style={{ color: 'var(--os-accent)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={20} /> TECHNICAL_SPECS
                </div>

                <div className="spec-group" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--os-text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>PROJECT_ID</div>
                  <div style={{ fontSize: '1rem' }}>{selectedProject.id}</div>
                </div>

                <div className="spec-group" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--os-text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>STACK</div>
                  <div style={{ fontSize: '0.9rem', lineBrake: 'anywhere' }}>
                    {selectedProject.skills?.join(', ') || 'N/A'}
                  </div>
                </div>

                <div className="spec-group" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--os-text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>ROLE</div>
                  <div style={{ fontSize: '1rem' }}>
                    {selectedProject.contributors && selectedProject.contributors.length > 1 ? 'CONTRIBUTOR' : 'LEAD DEVELOPER'}
                  </div>
                </div>

                <div className="spec-group" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--os-text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>STATUS</div>
                  <div style={{ fontSize: '1rem', color: getProjectStatus(selectedProject.duration) === 'COMPLETED' ? 'var(--os-accent)' : '#ffcc00' }}>
                    {getProjectStatus(selectedProject.duration)}
                  </div>
                </div>

                <div className="spec-group" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--os-text-muted)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>DURATION</div>
                  <div style={{ fontSize: '1rem' }}>{selectedProject.duration}</div>
                </div>

                <div className="links-section" style={{ marginTop: '3rem' }}>
                  <div style={{ color: 'var(--os-accent)', marginBottom: '1rem', fontSize: '0.8rem' }}>EXTERNAL_RESOURCES</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {selectedProject.links?.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--os-text)',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          border: '1px solid var(--os-grid)',
                          backgroundColor: 'rgba(255, 255, 255, 0.02)'
                        }}
                      >
                        {link.type === 'web' && <Globe size={14} />}
                        {link.type === 'download' && <Download size={14} />}
                        {link.type === 'github' && <ExternalLink size={14} />}
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center Column: Media Gallery */}
              <div className="dive-col" style={{
                backgroundColor: 'var(--os-bg)',
                padding: '2rem',
                borderRight: '1px solid var(--os-accent)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto'
              }}>
                <div style={{ color: 'var(--os-accent)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={20} /> MEDIA_GALLERY
                </div>
                <div className="gallery-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedProject.image ? (
                    <motion.img
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      style={{ width: '100%', height: 'auto', border: '1px solid var(--os-accent)', borderRadius: '4px' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: 'var(--os-grid)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed var(--os-accent)',
                      color: 'var(--os-text-muted)',
                      fontSize: '0.8rem'
                    }}>
                      NO_MEDIA_AVAILABLE
                    </div>
                  )}
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'rgba(204, 255, 0, 0.05)',
                    borderLeft: '3px solid var(--os-accent)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                  }}>
                    {selectedProject.description}
                  </div>
                </div>
              </div>

              {/* Right Column: Dev Log */}
              <div className="dive-col" style={{
                backgroundColor: 'var(--os-bg)',
                padding: '2rem',
                overflowY: 'auto'
              }}>
                <div style={{ color: 'var(--os-accent)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={20} /> DEV_LOG
                </div>
                <div className="dev-log-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {generateDevLog(selectedProject).map((milestone, i) => (
                    <div key={i} className="log-entry" style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.8rem',
                      borderLeft: '1px solid var(--os-grid)',
                      paddingLeft: '1rem'
                    }}>
                      <div style={{ color: 'var(--os-accent)', whiteSpace: 'nowrap' }}>
                        [{milestone.timestamp}]
                      </div>
                      <div style={{ color: 'var(--os-text)' }}>
                        &gt; {milestone.event}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProject.contributors && selectedProject.contributors.length > 0 && (
                  <div style={{ marginTop: '3rem' }}>
                    <div style={{ color: 'var(--os-accent)', marginBottom: '1rem', fontSize: '0.8rem' }}>CONTRIBUTORS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedProject.contributors.map((c, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--os-accent)', borderRadius: '50%' }}></div>
                          {c.name}
                          {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--os-accent)' }}><ExternalLink size={12} /></a>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectMatrix;
