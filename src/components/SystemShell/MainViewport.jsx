import React from 'react';

const MainViewport = ({ children }) => {
  const viewportStyle = {
    marginTop: '32px',
    marginBottom: '80px',
    minHeight: 'calc(100vh - 112px)',
    padding: '20px',
    position: 'relative',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={viewportStyle}>
      {children}
    </div>
  );
};

export default MainViewport;
