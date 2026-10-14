import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const EducationCard = (props) => {
  const education = props.education || props.edu || props.item || props;
  if (!education) return null;
  return (
    <Card3DTilt maxTilt={6} scale={1.01} className="w-100">
      <div className="exp-modal-3d-card education-card-3d">
        <div className="exp-3d-header">
          <div className="exp-3d-icon-badge badge-purple">
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <div className="exp-3d-meta">
            <h3 className="exp-3d-title">{education.institution}</h3>
            <h4 className="exp-3d-subtitle">{education.degree}</h4>
            <div className="exp-3d-pills">
              <span className="exp-pill font-mono">
                <i className="bi bi-calendar3 me-1"></i>
                {education.duration}
              </span>
              <span className="exp-pill exp-pill-highlight font-mono">
                <i className="bi bi-star-fill me-1 text-amber"></i>
                GPA: {education.gpa}
              </span>
            </div>
          </div>
        </div>

        <div className="exp-3d-body">
          {education.societies && education.societies.length > 0 && (
            <div className="exp-responsibilities-block mb-4">
              <h5 className="exp-block-heading font-mono">
                <i className="bi bi-people-fill me-1 text-purple"></i> Societies &amp; Honors
              </h5>
              <div className="exp-skills-tags-wrap">
                {education.societies.map((society, index) => (
                  <motion.span
                    key={index}
                    className="exp-skill-tag-3d tag-purple"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                  >
                    <i className="bi bi-award me-1"></i>
                    {society}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {education.skills && education.skills.length > 0 && (
            <div className="exp-skills-block">
              <h5 className="exp-block-heading font-mono">
                <i className="bi bi-cpu me-1 text-cyan"></i> Academic Focus &amp; Skills
              </h5>
              <div className="exp-skills-tags-wrap">
                {education.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="exp-skill-tag-3d"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card3DTilt>
  );
};

export default EducationCard;
