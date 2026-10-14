import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const AvatarHolo3D = ({
  src = '/photos/Lumatic_Headshot.jpg',
  alt = 'Karthik Nandakumar',
  statusText = 'Active Developer',
  gpaText = '4.0 GPA • ASU',
  honorText = 'Summa Cum Laude'
}) => {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 220;
    const height = mount.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Group for all rotating 3D holographic elements
    const holoGroup = new THREE.Group();
    scene.add(holoGroup);

    // Orbiting Satellite Nodes
    const satelliteGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const satelliteMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const satellite = new THREE.Mesh(satelliteGeo, satelliteMat);
    holoGroup.add(satellite);

    // Orbiting Particle Cloud
    const particleCount = 45;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.4 + (Math.random() - 0.5) * 0.8;
      posArray[i] = Math.cos(angle) * radius;
      posArray[i + 1] = Math.sin(angle) * radius;
      posArray[i + 2] = (Math.random() - 0.5) * 0.8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    holoGroup.add(particlePoints);

    let animationFrameId;
    let timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      satellite.position.x = Math.cos(elapsed * 0.8) * 2.5;
      satellite.position.y = Math.sin(elapsed * 0.8) * 2.5;
      satellite.position.z = Math.sin(elapsed * 1.2) * 0.4;

      particlePoints.rotation.z = elapsed * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      timer.dispose();
      satelliteGeo.dispose();
      satelliteMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = ((y - cy) / cy) * -16;
    const ry = ((x - cx) / cx) * 16;
    setTilt({ rx, ry, s: 1.05 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0, s: 1 });
  };

  return (
    <div
      ref={containerRef}
      className="avatar-holo-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '210px',
        height: '210px',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        userSelect: 'none'
      }}
    >
      {/* 3D Three.js Gyroscope Orbital Field */}
      <div
        ref={mountRef}
        className="avatar-holo-canvas"
        style={{
          position: 'absolute',
          top: '-35px',
          left: '-35px',
          width: '280px',
          height: '280px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 3D Tilting Core Token */}
      <div
        className="avatar-holo-core"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${tilt.s}, ${tilt.s}, ${tilt.s})`,
          transition: isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.4), inset 0 0 20px rgba(56, 189, 248, 0.3)'
            : '0 12px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.25), inset 0 0 15px rgba(56, 189, 248, 0.2)',
          zIndex: 2
        }}
      >
        {/* Layer 0: Multi-pass 3D Metallic Bezel */}
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(56, 189, 248, 0.8) 50%, rgba(30, 58, 138, 0.9) 100%)',
            padding: '4px',
            transform: 'translateZ(10px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Inner Image Mask */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              background: '#0b132b'
            }}
          >
            <img
              src={src}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            {/* Specular Glare Arc */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
                borderRadius: '50% 50% 0 0',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        {/* 3D Floating Credential Chip: 4.0 GPA */}
        <div
          className="avatar-floating-tag tag-top"
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-18px',
            transform: 'translateZ(38px)',
            background: 'rgba(11, 19, 43, 0.92)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.72rem',
            fontWeight: '700',
            fontFamily: 'monospace',
            padding: '3px 9px',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <i className="bi bi-mortarboard-fill"></i>
          <span>{gpaText}</span>
        </div>

        {/* 3D Floating Credential Chip: Summa Cum Laude */}
        <div
          className="avatar-floating-tag tag-bottom-right"
          style={{
            position: 'absolute',
            bottom: '-10px',
            right: '-14px',
            transform: 'translateZ(34px)',
            background: 'rgba(11, 19, 43, 0.92)',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 0 10px rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.70rem',
            fontWeight: '700',
            padding: '3px 9px',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <i className="bi bi-award-fill"></i>
          <span>{honorText}</span>
        </div>

        {/* 3D Floating Status Radar Badge */}
        <div
          className="avatar-status-badge"
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '-8px',
            transform: 'translateZ(42px)',
            background: 'rgba(11, 19, 43, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.6)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.7), 0 0 12px rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontSize: '0.70rem',
            fontWeight: '600',
            padding: '3px 8px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={statusText}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }}
          />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarHolo3D;
