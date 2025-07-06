import React from 'react';
import '../assets/contact.css';

const Contact = () => {
  // Social media links with icons
  const socialMediaItems = [
    {
      icon: 'bi-linkedin',
      label: 'LinkedIn',
      link: 'https://www.linkedin.com/in/karthiknandakumar1/',
      color: '#0077b5'
    },
    {
      icon: 'bi-github',
      label: 'GitHub',
      link: 'https://github.com/knandakumar25',
      color: '#333'
    }
  ];

  // Contact information as plain text
  const contactInfo = [
    {
      icon: 'bi-envelope-fill',
      label: 'Email',
      value: 'karthiknk21@gmail.com',
      color: '#ea4335'
    },
    {
      icon: 'bi-telephone-fill',
      label: 'Phone',
      value: '+1 (215) 666-3741',
      color: '#34a853'
    }
  ];

  return (
    <section className="contact-section">
      <div className="container">
        <div className="section-header">
          <div className="section-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>
          <h2 className="section-title anek-devanagari-font" style={{textAlign: 'center'}}>Get In Touch</h2>
          <p className="section-description" style={{textAlign: 'center'}}>
            Let's connect and discuss opportunities or collaborations
          </p>
        </div>
        
        <div className="contact-content">
          {/* Contact Information as Text */}
          <div className="contact-info-section">
            <h3 className="subsection-title" style={{textAlign: 'center'}}>Contact Information</h3>
            <div className="contact-info-list">
              {contactInfo.map((item, index) => (
                <div key={index} className="contact-info-item">
                  <div className="contact-icon-small" style={{ backgroundColor: item.color }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="contact-text">
                    <span className="contact-label-small">{item.label}</span>
                    <span className="contact-value-text">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="social-media-section">
            <h3 className="subsection-title" style={{textAlign: 'center'}}>Connect With Me</h3>
            <div className="social-media-icons">
              {socialMediaItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-link"
                  aria-label={item.label}
                  style={{ backgroundColor: item.color }}
                >
                  <i className={`bi ${item.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="contact-footer">
          <div className="footer-content">
            <p className="copyright" style={{textAlign: 'center'}}>
              All images used under the Creative Commons license.<br />
              Copyright © 2025 Karthik Nandakumar.
            </p>
            <div className="footer-decoration">
              <div className="decoration-line"></div>
              <div className="decoration-dot"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
