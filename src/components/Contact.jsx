import React from 'react';
import '../assets/contact.css';

const Contact = () => {
  const contactItems = [
    {
      icon: 'bi-linkedin',
      label: 'LinkedIn',
      value: 'Connect with me',
      link: 'https://www.linkedin.com/in/karthiknandakumar1/',
      color: '#0077b5'
    },
    {
      icon: 'bi-github',
      label: 'GitHub',
      value: 'View my code',
      link: 'https://github.com/knandakumar25',
      color: '#333'
    },
    {
      icon: 'bi-envelope-fill',
      label: 'Email',
      value: 'karthiknk21@gmail.com',
      link: 'mailto:karthiknk21@gmail.com',
      color: '#ea4335'
    },
    {
      icon: 'bi-telephone-fill',
      label: 'Phone',
      value: '+1 (215) 666-3741',
      link: 'tel:+12156663741',
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
          <h2 className="section-title anek-devanagari-font">Get In Touch</h2>
          <p className="section-description">
            Let's connect and discuss opportunities or collaborations
          </p>
        </div>
        
        <div className="contact-grid">
          {contactItems.map((item, index) => (
            <div key={index} className="contact-card">
              <div className="contact-icon" style={{ backgroundColor: item.color }}>
                <i className={`bi ${item.icon}`}></i>
              </div>
              <h3 className="contact-label">{item.label}</h3>
              <p className="contact-value">{item.value}</p>
              <a 
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-link"
                aria-label={`${item.label} - ${item.value}`}
              >
                <span>Connect</span>
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
        
        <div className="contact-footer">
          <div className="footer-content">
            <p className="copyright">
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
