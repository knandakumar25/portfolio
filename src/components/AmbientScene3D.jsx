import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AmbientScene3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Performance optimized for background
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // 1. 3D Particle Constellation
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x38bdf8);
    const indigoColor = new THREE.Color(0x6366f1);
    const blueColor = new THREE.Color(0x1d4ed8);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 220;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 220;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 140;

      // Color variation
      const r = Math.random();
      const chosenColor = r < 0.45 ? cyanColor : r < 0.8 ? indigoColor : blueColor;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 2. Subtle 3D Flow Wave Plane
    const gridCols = 32;
    const gridRows = 32;
    const planeGeo = new THREE.PlaneGeometry(160, 160, gridCols, gridRows);
    planeGeo.rotateX(-Math.PI / 2.3);
    planeGeo.translate(0, -35, -20);

    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });

    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    scene.add(planeMesh);

    // Mouse & Scroll Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const onPointerMove = (e) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY * 0.05;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize handler
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return; // Pause when tab is hidden

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Parallax camera
      camera.position.x = mouseX * 12;
      camera.position.y = -mouseY * 10 - scrollY;
      camera.lookAt(0, -scrollY * 0.5, 0);

      // Slow particle rotation
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Undulate wave grid vertices
      const pos = planeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = i % (gridCols + 1);
        const v = Math.floor(i / (gridCols + 1));
        const z = Math.sin(u * 0.35 + elapsedTime * 1.2) * Math.cos(v * 0.35 + elapsedTime * 0.9) * 2.8;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      particleGeo.dispose();
      particleMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="ambient-3d-canvas-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};

export default AmbientScene3D;
