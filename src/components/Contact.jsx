import React from 'react';
import '../assets/contact.css';

const Contact = () => {
  return (
    <footer className="modern-footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Contact Info Section */}
          <div className="footer-section contact-info">
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
            </div>
          </div>

          {/* Social Links Section */}
          <div className="footer-section social-section">
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
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">© 2025 Karthik Nandakumar. All rights reserved.</p>
          <p className="attribution">All images used under the Creative Commons license.</p>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
