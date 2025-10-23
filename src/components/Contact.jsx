import React from 'react';
import '../assets/contact.css';

const Contact = () => {
  return (
    <footer className="bg-dark text-light py-3">
      <div className="container">
        <div className="row align-items-center mb-2">
          <div className="col-12">
            <div className="alert alert-info mb-0 py-2 px-3 small" style={{ backgroundColor: '#d1ecf1', color: '#0c5460', border: 'none' }}>
              <i className="bi bi-info-circle-fill me-2"></i>
              <strong>Email Update:</strong> I'm transitioning from karthiknk21@gmail.com to karthiknk21@proton.me. Both email addresses are currently active.
            </div>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="d-flex flex-wrap align-items-center gap-3 small">
              <span><i className="bi bi-envelope-fill me-1"></i>karthiknk21@gmail.com</span>
              <span><i className="bi bi-envelope-fill me-1"></i>karthiknk21@proton.me</span>
              <span><i className="bi bi-telephone-fill me-1"></i>+1 (215) 666-3741</span>
              <span>All images used under the Creative Commons license.</span>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="d-flex justify-content-md-end justify-content-start align-items-center gap-3 mt-2 mt-md-0">
              <a
                href="https://www.linkedin.com/in/karthiknandakumar1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://github.com/knandakumar25"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
                aria-label="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
              <span className="small text-muted">© 2025 Karthik Nandakumar</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
