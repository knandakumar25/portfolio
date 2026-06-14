import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillTag = ({ text }) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 8px',
    margin: '0 4px',
    fontSize: '0.7rem',
    fontFamily: 'var(--os-font-mono)',
    color: 'var(--os-accent)',
    border: '1px solid var(--os-accent)',
    borderRadius: '4px',
    textTransform: 'uppercase',
    boxShadow: '0 0 5px rgba(204, 255, 0, 0.3)',
    cursor: 'default',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle'
  }}>
    {text}
  </span>
);

const DataRecord = ({ id, title, date, details, skills, renderDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        cursor: 'pointer',
        marginBottom: '4px',
        borderLeft: isExpanded ? '3px solid var(--os-accent)' : '3px solid transparent',
        backgroundColor: 'var(--os-glass)',
        transition: 'border-color 0.2s ease',
        overflow: 'hidden'
      }}
    >
      {/* Collapsed Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr 150px',
        padding: '8px 12px',
        alignItems: 'center',
        fontFamily: 'var(--os-font-mono)',
        fontSize: '0.85rem',
        color: 'var(--os-text)',
        userSelect: 'none'
      }}>
        <div style={{ color: 'var(--os-text-muted)', opacity: 0.8 }}>{id}</div>
        <div style={{ fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ textAlign: 'right', color: 'var(--os-text-muted)' }}>{date}</div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              padding: '0 12px 16px 12px',
              borderTop: '1px solid rgba(204, 255, 0, 0.1)',
              fontFamily: 'var(--os-font-mono)',
              fontSize: '0.8rem',
              color: 'var(--os-text)'
            }}
          >
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {renderDetails ? (
                renderDetails()
              ) : (
                <div style={{ opacity: 0.9, lineHeight: '1.5' }}>
                  {details}
                </div>
              )}

              {skills && skills.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--os-text-muted)', marginBottom: '6px', opacity: 0.6 }}>
                    {`> SYSTEM_TAGS: `}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {skills.map((skill, idx) => (
                      <SkillTag key={idx} text={skill} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DataSheet = ({ data, idPrefix, titleField, dateField, renderDetails }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '10px'
    }}>
      {data.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          fontFamily: 'var(--os-font-mono)',
          color: 'var(--os-text-muted)'
        }}>
          NO_RECORDS_FOUND
        </div>
      ) : (
        data.map((item, index) => (
          <DataRecord
            key={item.id || index}
            id={`${idPrefix}_${(index + 1).toString().padStart(3, '0')}`}
            title={item[titleField]}
            date={item[dateField]}
            skills={item.skills}
            renderDetails={() => renderDetails(item)}
          />
        ))
      )}
    </div>
  );
};

export default DataSheet;
