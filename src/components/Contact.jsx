import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/contact.css';

const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [attachment, setAttachment] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setAttachment(null);
      return;
    }

    if (!ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
      setAttachment(null);
      setErrorMessage('Unsupported file type. Allowed: PDF, PNG, JPG, TXT, DOCX.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAttachment(null);
      setErrorMessage('Attachment exceeds 2 MB limit.');
      e.target.value = '';
      return;
    }

    setErrorMessage('');
    setAttachment(file);
  };

  const parseErrorResponse = async (response) => {
    const responseText = await response.text();

    try {
      const data = JSON.parse(responseText);
      return data.error || 'Something went wrong';
    } catch {
      return 'Request failed. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('subject', formData.subject);
      payload.append('message', formData.message);
      if (attachment) {
        payload.append('attachment', attachment);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setAttachment(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const error = await parseErrorResponse(response);
        throw new Error(error);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
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
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                ref={fileInputRef}
                type="file"
                name="attachment"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.docx"
                onChange={handleFileChange}
              />
              <small>Optional attachment (1 file, max 2 MB): PDF, PNG, JPG, TXT, DOCX</small>
            </div>
            <motion.button
              type="submit"
              className={`submit-btn ${status === 'submitting' ? 'loading' : ''}`}
              disabled={status === 'submitting'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </motion.button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="form-status success"
                >
                  Message sent successfully!
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="form-status error"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
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
