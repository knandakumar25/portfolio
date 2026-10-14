import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TAB_THEMES = {
  work: { color: 0x38bdf8, label: 'Enterprise Experience', ringIdx: 0 },
  simulations: { color: 0x818cf8, label: 'Industry Simulations', ringIdx: 1 },
  education: { color: 0xf59e0b, label: 'Academic Excellence (4.0 GPA)', ringIdx: 2 },
  volunteering: { color: 0x34d399, label: 'Community & Leadership', ringIdx: 3 },
  organizations: { color: 0xec4899, label: 'Engineering Societies', ringIdx: 4 }
};

const ExperiencesOrb3D = ({ activeTab = 'work' }) => {
  const mountRef = useRef(null);
  const ringsRef = useRef([]);
  const coreRef = useRef(null);
  const pointLightRef = useRef(null);
  const targetColorRef = useRef(new THREE.Color(0x38bdf8));

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3.5, 12);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // Central Sphere
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      wireframe: true,
      emissive: 0x2563eb,
      emissiveIntensity: 0.8
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);
    coreRef.current = core;

    // Orbiting Milestone Nodes without loops
    const nodeRadii = [1.35, 1.85, 2.35, 2.85, 3.35];
    const rings = [];

    nodeRadii.forEach((radius, i) => {
      const orbitPivot = new THREE.Group();
      orbitPivot.rotation.x = Math.PI / 3 + (i * Math.PI) / 6;
      orbitPivot.rotation.y = (i * Math.PI) / 4;
      scene.add(orbitPivot);

      const tokenGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const tokenMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.9
      });
      const token = new THREE.Mesh(tokenGeo, tokenMat);
      token.position.set(radius, 0, 0);
      orbitPivot.add(token);

      rings.push({ mesh: orbitPivot, token, radius });
    });
    ringsRef.current = rings;

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

    // Animation Loop
    let animationFrameId;
    let timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      core.rotation.x = elapsed * 0.3;
      core.rotation.y = elapsed * 0.45;

      rings.forEach((ringObj, i) => {
        ringObj.mesh.rotation.z += 0.005 * (i % 2 === 0 ? 1 : -1);
        ringObj.mesh.rotation.x += 0.003;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      coreGeo.dispose();
      coreMat.dispose();
      timer.dispose();
      renderer.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // React to active tab changes
  useEffect(() => {
    const theme = TAB_THEMES[activeTab] || TAB_THEMES.work;
    const color = new THREE.Color(theme.color);

    if (pointLightRef.current) {
      pointLightRef.current.color = color;
    }

    if (coreRef.current) {
      coreRef.current.material.emissive = color;
    }

    if (ringsRef.current.length > 0) {
      ringsRef.current.forEach((r, idx) => {
        const isHighlight = idx === theme.ringIdx;
        r.mesh.scale.set(isHighlight ? 1.15 : 1, isHighlight ? 1.15 : 1, isHighlight ? 1.15 : 1);
        r.token.material.emissive = isHighlight ? color : new THREE.Color(0x38bdf8);
        r.token.scale.set(isHighlight ? 1.5 : 1, isHighlight ? 1.5 : 1, isHighlight ? 1.5 : 1);
      });
    }
  }, [activeTab]);

  const currentTheme = TAB_THEMES[activeTab] || TAB_THEMES.work;

  return (
    <div className="experiences-3d-hub" style={{ position: 'relative', width: '100%', height: '220px', margin: '0 auto 2rem' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      <div
        className="hub-3d-label"
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono, monospace)',
          background: 'rgba(11, 19, 38, 0.8)',
          border: `1px solid #${currentTheme.color.toString(16).padStart(6, '0')}`,
          boxShadow: `0 0 15px rgba(${currentTheme.color >> 16}, ${(currentTheme.color >> 8) & 255}, ${currentTheme.color & 255}, 0.25)`,
          padding: '4px 14px',
          borderRadius: '20px',
          color: '#f8fafc',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: `#${currentTheme.color.toString(16).padStart(6, '0')}`, marginRight: '8px' }} />
        Active Track: {currentTheme.label}
      </div>
    </div>
  );
};

export default ExperiencesOrb3D;
