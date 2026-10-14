import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GameCartridge3D = ({ title = 'Arcade Experience', imageUrl = null }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xec4899, 2);
    dirLight.position.set(4, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 10);
    pointLight.position.set(-3, -2, 4);
    scene.add(pointLight);

    // Cartridge Group
    const cartGroup = new THREE.Group();
    scene.add(cartGroup);

    // 1. Cartridge Main Body (Retro Cartridge Form)
    const bodyGeo = new THREE.BoxGeometry(2.4, 3.2, 0.45);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.6
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    cartGroup.add(bodyMesh);

    // Top Grip Ribs
    for (let r = 0; r < 4; r++) {
      const ribGeo = new THREE.BoxGeometry(2.1, 0.08, 0.52);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.y = 1.05 + r * 0.16;
      cartGroup.add(rib);
    }

    // Front Label Plate / Screen
    const labelGeo = new THREE.PlaneGeometry(1.85, 1.85);
    let labelMat;

    if (imageUrl) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(imageUrl);
      labelMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    } else {
      labelMat = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        emissive: 0xdb2777,
        emissiveIntensity: 0.5,
        roughness: 0.4
      });
    }

    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.z = 0.235;
    labelMesh.position.y = -0.3;
    cartGroup.add(labelMesh);

    // Glowing Neon Hologram Ring around cartridge
    const ringGeo = new THREE.RingGeometry(2.3, 2.38, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    cartGroup.add(ring);

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      cartGroup.rotation.y += deltaX * 0.01;
      cartGroup.rotation.x += deltaY * 0.01;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

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
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        cartGroup.rotation.y += 0.008;
        cartGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.12;
      }

      ring.rotation.z += 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();
      bodyGeo.dispose();
      bodyMat.dispose();
      labelGeo.dispose();
      labelMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl, title]);

  return (
    <div className="game-3d-cartridge-container" style={{ position: 'relative', width: '100%', height: '320px', margin: '0 auto 1.5rem' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono, monospace)',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          boxShadow: '0 0 16px rgba(236, 72, 153, 0.25)',
          padding: '4px 14px',
          borderRadius: '20px',
          color: '#f472b6',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <i className="bi bi-joystick"></i> 3D Cartridge Model • Drag to Inspect
      </div>
    </div>
  );
};

export default GameCartridge3D;
