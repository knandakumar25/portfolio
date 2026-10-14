import React, { useRef, useState, useCallback } from 'react';

const Card3DTilt = ({
  children,
  className = '',
  style = {},
  maxTilt = 7,
  scale = 1.015,
  glare = true,
  onClick
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlareStyle({
        opacity: 0.18,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`
      });
    }
  }, [maxTilt, scale, glare]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d-tilt ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
    >
      {children}

      {/* Dynamic Specular Light Sheen */}
      {glare && (
        <div
          className="card-3d-glare"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 3,
            transition: 'opacity 0.35s ease',
            ...glareStyle
          }}
        />
      )}
    </div>
  );
};

export default Card3DTilt;
