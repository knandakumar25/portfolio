import React from 'react';
import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';
import '../assets/contact.css';

const Contact = () => {
  return (
    <footer className="modern-footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Contact Info 3D Card */}
          <motion.div
            className="footer-card-tilt-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card3DTilt maxTilt={5} scale={1.015} className="h-100">
              <div className="footer-3d-card contact-info-card h-100">
                <div className="footer-card-header">
                  <div className="footer-card-icon">
                    <i className="bi bi-send-fill"></i>
                  </div>
                  <div>
                    <h3 className="footer-heading">Get In Touch</h3>
                    <p className="footer-subheading">Open to Full-Stack &amp; Systems Engineering roles</p>
                  </div>
                </div>

                <div className="contact-items-3d">
                  <a href="mailto:karthiknk21@gmail.com" className="contact-item-3d">
                    <i className="bi bi-envelope-fill"></i>
                    <span>karthiknk21@gmail.com</span>
                  </a>
                  <a href="tel:+12156663741" className="contact-item-3d">
                    <i className="bi bi-telephone-fill"></i>
                    <span>+1 (215) 666-3741</span>
                  </a>
                  <div className="contact-item-3d">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>Cary, North Carolina, United States, 27519</span>
                  </div>
                  <div className="contact-item-3d">
                    <i className="bi bi-person-badge-fill"></i>
                    <span>Authorized to work in United States and India</span>
                  </div>
                </div>
              </div>
            </Card3DTilt>
          </motion.div>

          {/* Social Links 3D Card */}
          <motion.div
            className="footer-card-tilt-wrap"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card3DTilt maxTilt={5} scale={1.015} className="h-100">
              <div className="footer-3d-card social-section-card h-100">
                <div className="footer-card-header">
                  <div className="footer-card-icon icon-cyan">
                    <i className="bi bi-share-fill"></i>
                  </div>
                  <div>
                    <h3 className="footer-heading">Connect With Me</h3>
                    <p className="footer-subheading">Explore code repositories and professional network</p>
                  </div>
                </div>

                <div className="social-links-3d-grid">
                  <a
                    href="https://www.linkedin.com/in/karthiknandakumar1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn-3d linkedin"
                    aria-label="LinkedIn"
                  >
                    <i className="bi bi-linkedin"></i>
                    <span>LinkedIn Profile</span>
                  </a>
                  <a
                    href="https://github.com/knandakumar25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn-3d github"
                    aria-label="GitHub"
                  >
                    <i className="bi bi-github"></i>
                    <span>GitHub Repositories</span>
                  </a>
                  <a
                    href="mailto:karthiknk21@gmail.com"
                    className="social-btn-3d email"
                    aria-label="Direct Email"
                  >
                    <i className="bi bi-envelope-check-fill"></i>
                    <span>Send Message</span>
                  </a>
                </div>
              </div>
            </Card3DTilt>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 Karthik Nandakumar. All rights reserved.</p>
          <p className="attribution">Crafted with React, Three.js &amp; Spatial 3D Architecture.</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
