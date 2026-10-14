import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CertificationsPolyhedron3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfbbf24, 2.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 12);
    pointLight.position.set(-3, -2, 3);
    scene.add(pointLight);

    // Central 3D Gem / Polyhedron
    const gemGeo = new THREE.OctahedronGeometry(1.2, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.1,
      metalness: 0.85,
      wireframe: true,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.6
    });
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    scene.add(gemMesh);

    // Inner Solid Core
    const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.7
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Sparkling floating credential particles
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.6 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    currentMount.addEventListener('pointermove', onPointerMove);

    // Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(currentMount);

    // Animation
    let animationFrameId;
    let timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      gemMesh.rotation.x = elapsed * 0.4 + mouseY * 0.4;
      gemMesh.rotation.y = elapsed * 0.5 + mouseX * 0.4;

      innerMesh.rotation.x = -elapsed * 0.3;
      innerMesh.rotation.y = -elapsed * 0.4;

      particles.rotation.y = elapsed * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      gemGeo.dispose();
      gemMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      timer.dispose();
      renderer.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="cert-3d-polyhedron-wrap" style={{ position: 'relative', width: '100%', height: '230px', margin: '0 auto 1.5rem' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      <div
        className="cert-3d-badge-pill"
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono, monospace)',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(251, 191, 36, 0.4)',
          boxShadow: '0 0 16px rgba(251, 191, 36, 0.25)',
          padding: '4px 14px',
          borderRadius: '20px',
          color: '#fbbf24',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <i className="bi bi-patch-check-fill" style={{ color: '#fbbf24' }}></i>
        3D Credential Core • 8+ Verified Badges
      </div>
    </div>
  );
};

export default CertificationsPolyhedron3D;
