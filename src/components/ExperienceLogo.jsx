import React, { useState } from 'react';

const ExperienceLogo = ({ logo, icon, className }) => {
  const [failedLogo, setFailedLogo] = useState(null);
  const showLogo = logo && logo !== failedLogo;

  return (
    <div className={showLogo ? `${className} experience-logo` : className}>
      {showLogo ? (
        <img src={logo} alt="" onError={() => setFailedLogo(logo)} />
      ) : (
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      )}
    </div>
  );
};

export default ExperienceLogo;
