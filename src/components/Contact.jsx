import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactUplink from './Modules/ContactUplink';
import '../assets/contact.css';

const Contact = () => {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');


  const parseErrorResponse = async (response) => {
    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      return data.error || 'Something went wrong';
    } catch {
      return 'Request failed. Please try again.';
    }
  };

  const sendSignal = async (formData) => {
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('subject', 'Signal Terminal Transmission');
      payload.append('message', formData.message);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        return { success: true };
      } else {
        const error = await parseErrorResponse(response);
        return { success: false, error };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <footer className="modern-footer">
      <div className="container">
        {/* Contact Form Section */}
        <motion.div
          className="contact-form-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h3 className="footer-heading">Send a Message</h3>
          <ContactUplink sendSignal={sendSignal} />
        </motion.div>
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Contact Info Section */}
          <motion.div
            className="footer-section contact-info"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="footer-heading">Get In Touch</h3>
            <div className="contact-items">
              <a href="mailto:karthiknk21@gmail.com" className="contact-item">
                <i className="bi bi-envelope-fill"></i>
                <span>karthiknk21@gmail.com</span>
              </a>
              <a href="tel:+12156663741" className="contact-item">
                <i className="bi bi-telephone-fill"></i>
                <span>+1 (215) 666-3741</span>
              </a>
              <div className="contact-item">
                <i className="bi bi-geo-alt-fill"></i>
                <span>Cary, North Carolina, United States, 27519</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-person-badge-fill"></i>
                <span>Authorized to work in both the United States and India</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links Section */}
          <motion.div
            className="footer-section social-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="footer-heading">Connect With Me</h3>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/in/karthiknandakumar1/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/knandakumar25"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <i className="bi bi-github"></i>
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 Karthik Nandakumar. All rights reserved.</p>
          <p className="attribution">All images used under the Creative Commons license.</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
